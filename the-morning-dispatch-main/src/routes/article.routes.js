const express = require('express')

const router = express.Router()
const { getArticles } = require('../controllers/article.controller')

// Read-only articles route
router.get('/', getArticles)

module.exports = router
