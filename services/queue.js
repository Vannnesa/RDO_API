const Queue = require('bull');
const { scrapePlayerData } = require('./scraper');
const PlayerData = require('../models/PlayerData');
const History = require('../models/History');
const { nanoid } = require('nanoid');

const scraperQueue = new Queue('scraper', process.env.REDIS_URL);

scraperQueue.process(async (job) => {
  const { playerid } = job.data;
  try {
    const data = await scrapePlayerData(playerid);
    await PlayerData.findOneAndUpdate(
      { playerid },
      { data, lastUpdated: new Date() },
      { upsert: true }
    );
    await History.create({
      index: nanoid(6),
      playerid,
      data,
      status: '可用'
    });
  } catch (error) {
    console.error(`爬取失败: ${error.message}`);
  }
});

module.exports = scraperQueue;