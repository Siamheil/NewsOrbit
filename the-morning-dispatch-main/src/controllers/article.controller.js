const articleModel = require('../models/article.model');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function isPositiveInteger(val) {
    return typeof val === 'string' && /^[1-9]\d*$/.test(val.trim());
}

function parseDateParam(val, isEnd = false) {
    if (!val || typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (!trimmed) return null;

    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyRegex.test(trimmed)) {
        const isoString = isEnd ? `${trimmed}T23:59:59.999Z` : `${trimmed}T00:00:00.000Z`;
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return null;
        if (d.toISOString().slice(0, 10) !== trimmed) return null;
        return d;
    }

    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return null;
    return d;
}

async function getArticles(req, res, next) {
    try {
        let page = DEFAULT_PAGE;
        if (req.query.page !== undefined) {
            if (!isPositiveInteger(req.query.page)) {
                return res.status(400).json({
                    success: false,
                    message: "page must be a positive integer"
                });
            }
            page = parseInt(req.query.page, 10);
        }

        let limit = DEFAULT_LIMIT;
        if (req.query.limit !== undefined) {
            if (!isPositiveInteger(req.query.limit)) {
                return res.status(400).json({
                    success: false,
                    message: "limit must be a positive integer"
                });
            }
            const parsedLimit = parseInt(req.query.limit, 10);
            if (parsedLimit > MAX_LIMIT) {
                return res.status(400).json({
                    success: false,
                    message: `limit cannot exceed maximum of ${MAX_LIMIT}`
                });
            }
            limit = parsedLimit;
        }

        const skip = (page - 1) * limit;

        const { source, sourceSlug, topic, from, to, sort } = req.query;

        let filter = {};

        if (source) {
            filter.$or = [
                { source: source },
                { sourceSlug: source }
            ];
        } else if (sourceSlug) {
            filter.sourceSlug = sourceSlug;
        }

        if (topic) {
            filter.topic = topic;
        }

        if (from !== undefined || to !== undefined) {
            let fromDate = null;
            let toDate = null;
            let dateFilter = {};

            if (from !== undefined) {
                fromDate = parseDateParam(from, false);
                if (!fromDate) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid 'from' date: "${from}". Expected format: YYYY-MM-DD or valid ISO date.`
                    });
                }
                dateFilter.$gte = fromDate;
            }

            if (to !== undefined) {
                toDate = parseDateParam(to, true);
                if (!toDate) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid 'to' date: "${to}". Expected format: YYYY-MM-DD or valid ISO date.`
                    });
                }
                dateFilter.$lte = toDate;
            }

            if (fromDate && toDate && fromDate > toDate) {
                return res.status(400).json({
                    success: false,
                    message: "'from' date cannot be later than 'to' date."
                });
            }

            filter.publishedAt = dateFilter;
        }

        let sortOrder = { publishedAt: -1 };

        if (sort !== undefined) {
            if (sort === 'newest') {
                sortOrder = { publishedAt: -1 };
            } else if (sort === 'oldest') {
                sortOrder = { publishedAt: 1 };
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Invalid 'sort' value: "${sort}". Supported values are 'newest' or 'oldest'.`
                });
            }
        }

        const articles = await articleModel
            .find(filter)
            .sort(sortOrder)
            .skip(skip)
            .limit(limit);

        const total = await articleModel.countDocuments(filter);
        const pages = Math.ceil(total / limit);

        res.json({
            articles,
            pagination: {
                page,
                limit,
                total,
                pages
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getArticles };