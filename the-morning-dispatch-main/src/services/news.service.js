require('dotenv').config()
const axios = require('axios')
const crypto = require('crypto')
const Article = require('../models/article.model')
const { getSource, getAllSources } = require('../config/sources')

const fetchNewsBySource = async (sourceSlug) => {
    const sourceConfig = getSource(sourceSlug)
    if (!sourceConfig) {
        console.error(`Unsupported source: "${sourceSlug}". Ingestion skipped.`)
        return {
            source: sourceSlug,
            sourceName: sourceSlug,
            fetched: 0,
            inserted: 0,
            updated: 0,
            failed: 0,
            success: false,
            error: `Unsupported source: "${sourceSlug}"`
        }
    }

    try {
        console.log(`Fetching ${sourceConfig.name} news...`)
        const response = await axios.get(
            'https://newsapi.org/v2/top-headlines',
            {
                params: {
                    sources: sourceConfig.newsApiId,
                    apiKey: process.env.NEWS_API_KEY
                }
            }
        )

        const articles = response.data.articles || []
        console.log(`[${sourceConfig.name}] Fetched ${articles.length} articles from NewsAPI`)

        const now = new Date()
        const normalisedArticles = articles.map((article) => {
            const uniqueString = (article.title || "") + (article.publishedAt || "") + sourceConfig.sourceSlug
            const sourceArticleId = crypto.createHash("md5").update(uniqueString).digest("hex")

            return {
                sourceArticleId,
                title: article.title,
                description: article.description || "",
                url: article.url,
                imageUrl: article.urlToImage || "",
                source: article.source?.name || sourceConfig.name,
                sourceSlug: sourceConfig.sourceSlug,
                topic: "general",
                publishedAt: article.publishedAt ? new Date(article.publishedAt) : now,
                fetchedAt: now
            }
        })

        let inserted = 0
        let updated = 0
        let failed = 0

        if (normalisedArticles.length > 0) {
            const bulkOps = normalisedArticles.map((article) => ({
                updateOne: {
                    filter: { sourceArticleId: article.sourceArticleId },
                    update: {
                        $set: {
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            imageUrl: article.imageUrl,
                            source: article.source,
                            sourceSlug: article.sourceSlug,
                            topic: article.topic,
                            publishedAt: article.publishedAt,
                            fetchedAt: article.fetchedAt,
                            updatedAt: now
                        },
                        $setOnInsert: {
                            sourceArticleId: article.sourceArticleId,
                            createdAt: now
                        }
                    },
                    upsert: true
                }
            }))

            try {
                const bulkResult = await Article.bulkWrite(bulkOps, { ordered: false })
                inserted = bulkResult.upsertedCount || 0
                updated = (bulkResult.modifiedCount !== undefined) ? bulkResult.modifiedCount : (bulkResult.matchedCount || 0)
                console.log(`[${sourceConfig.name}] Ingested: ${inserted} inserted, ${updated} updated`)
            } catch (error) {
                if (error.name === 'MongoBulkWriteError' && error.result) {
                    inserted = error.result.upsertedCount || 0
                    updated = error.result.modifiedCount || error.result.matchedCount || 0
                    failed = error.writeErrors ? error.writeErrors.length : 0
                    console.warn(`[${sourceConfig.name}] BulkWrite partial completion: ${inserted} inserted, ${updated} updated, ${failed} failed`)
                } else {
                    console.error(`[${sourceConfig.name}] BulkWrite error:`, error.message)
                    throw error
                }
            }
        } else {
            console.log(`[${sourceConfig.name}] 0 articles to ingest`)
        }

        return {
            source: sourceConfig.sourceSlug,
            sourceName: sourceConfig.name,
            fetched: articles.length,
            inserted,
            updated,
            failed,
            success: true
        }
    } catch (error) {
        console.error(`[${sourceConfig.name}] Ingestion failed: ${error.message}`)
        return {
            source: sourceConfig.sourceSlug,
            sourceName: sourceConfig.name,
            fetched: 0,
            inserted: 0,
            updated: 0,
            failed: 0,
            success: false,
            error: error.message
        }
    }
}

const fetchAllSources = async () => {
    const sources = getAllSources()
    console.log(`Starting multi-source ingestion for ${sources.length} sources...`)

    const results = await Promise.allSettled(
        sources.map((sourceConfig) => fetchNewsBySource(sourceConfig.sourceSlug))
    )

    const summary = results.map((result, idx) => {
        const sourceConfig = sources[idx]
        if (result.status === "fulfilled" && result.value) {
            return result.value
        } else {
            return {
                source: sourceConfig.sourceSlug,
                sourceName: sourceConfig.name,
                fetched: 0,
                inserted: 0,
                updated: 0,
                failed: 0,
                success: false,
                error: result.reason ? result.reason.message : "Unknown error"
            }
        }
    })

    console.log("=== Multi-Source Ingestion Summary ===")
    summary.forEach((item) => {
        if (item.success) {
            console.log(`✓ [${item.sourceName}] Fetched: ${item.fetched}, Inserted: ${item.inserted}, Updated: ${item.updated}, Failed: ${item.failed}`)
        } else {
            console.log(`✗ [${item.sourceName}] Failed: ${item.error}`)
        }
    })

    return summary
}

module.exports = {
    fetchNewsBySource,
    fetchAllSources
}