const express = require('express');
const router = express.Router();
const PlayerData = require('../models/PlayerData');
const scraperQueue = require('../services/queue');
const { isExpired } = require('../utils/helpers');

router.post('/post', async (req, res) => {
  const { playerid } = req.query;
  if (!playerid) return res.status(503).json({ code: 503, msg: "缺少必填参数" });

  const playerData = await PlayerData.findOne({ playerid });
  if (playerData && !isExpired(playerData.lastUpdated)) {
    return res.json({ code: 303, msg: "数据仍在有效期内" });
  }

  await scraperQueue.add({ playerid });
  const count = await scraperQueue.count();
  res.json({ code: 521, msg: `队列中有${count}个请求，需等待约${count * 10}秒` });
});

router.get('/history', async (req, res) => {
  const { playerid, limit = 10 } = req.query;
  if (!playerid) return res.status(503).json({ code: 503, msg: "缺少必填参数" });

  const history = await History.find({ playerid })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));
  res.json({ code: 200, body: history });
});

module.exports = router;