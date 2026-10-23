const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    sourceSlug: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      default: "",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    sourceArticleId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

articleSchema.index({publishedAt:-1})
articleSchema.index({source:1})
articleSchema.index({topic:1})


const articleModel = mongoose.model("Article", articleSchema);

module.exports = articleModel;
