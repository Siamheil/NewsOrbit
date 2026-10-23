const SOURCES = {
  "bbc-news": {
    sourceSlug: "bbc-news",
    newsApiId: "bbc-news",
    name: "BBC News",
  },
  "cnn": {
    sourceSlug: "cnn",
    newsApiId: "cnn",
    name: "CNN",
  },
  "reuters": {
    sourceSlug: "reuters",
    newsApiId: "reuters",
    name: "Reuters",
  },
  "fox-news": {
    sourceSlug: "fox-news",
    newsApiId: "fox-news",
    name: "Fox News",
  },
};

const getSource = (sourceSlug) => {
  if (!sourceSlug) return null;
  return SOURCES[sourceSlug] || null;
};

const getAllSources = () => Object.values(SOURCES);

const isValidSource = (sourceSlug) => Boolean(SOURCES[sourceSlug]);

module.exports = {
  SOURCES,
  getSource,
  getAllSources,
  isValidSource,
};
