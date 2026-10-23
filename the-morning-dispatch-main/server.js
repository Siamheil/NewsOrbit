const app = require("./src/app")
const connectDB = require("./src/db/db")
const { fetchAllSources } = require("./src/services/news.service");
const { startScheduler } = require("./src/jobs/scheduler");
require("dotenv").config()

async function startServer() {
    try {
        await connectDB();

        const PORT = process.env.PORT || 2005;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`TMD Server running on port ${PORT}`);
        });

        startScheduler();

        await fetchAllSources();
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}



startServer();