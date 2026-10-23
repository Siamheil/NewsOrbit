const cron = require('node-cron');
const newsService = require('../services/news.service');

const DEFAULT_SCHEDULE = '*/30 * * * *';

let isIngestionRunning = false;
let cronTask = null;

const runIngestionJob = async () => {
    if (isIngestionRunning) {
        console.warn('[Scheduler] Previous ingestion is still in progress. Skipping this scheduled execution.');
        return null;
    }

    isIngestionRunning = true;
    console.log('[Scheduler] Starting scheduled ingestion...');

    try {
        const summary = await newsService.fetchAllSources();
        console.log('[Scheduler] Ingestion completed successfully');
        return summary;
    } catch (error) {
        console.error('[Scheduler] Scheduled ingestion encountered an error:', error.message);
        return null;
    } finally {
        isIngestionRunning = false;
    }
};

const startScheduler = (cronExpression = DEFAULT_SCHEDULE) => {
    if (cronTask) {
        console.warn('[Scheduler] Scheduler is already initialized and running.');
        return cronTask;
    }

    if (!cron.validate(cronExpression)) {
        throw new Error(`[Scheduler] Invalid cron expression: "${cronExpression}"`);
    }

    console.log(`[Scheduler] Initializing cron scheduler with schedule: "${cronExpression}"`);
    cronTask = cron.schedule(cronExpression, async () => {
        await runIngestionJob();
    });

    return cronTask;
};

const stopScheduler = () => {
    if (cronTask) {
        cronTask.stop();
        cronTask = null;
        console.log('[Scheduler] Cron scheduler stopped.');
    }
};

const isJobRunning = () => isIngestionRunning;

module.exports = {
    DEFAULT_SCHEDULE,
    startScheduler,
    stopScheduler,
    runIngestionJob,
    isJobRunning,
};
