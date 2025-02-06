function isExpired(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  return diff > 12 * 60 * 60 * 1000; // 12小时
}

module.exports = { isExpired };