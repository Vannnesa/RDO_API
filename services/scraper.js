const puppeteer = require('puppeteer');
const elementsConfig = require('../config/elements.json');

async function scrapePlayerData(playerid) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://socialclub.rockstargames.com/member/${playerid}/games/rdo/pc/overview`);
    await page.waitForSelector('script[src*="common.js"]', { timeout: 15000 });
    await page.waitForTimeout(10000);

    const notFound = await page.$('.error-message');
    if (notFound) throw new Error('玩家不存在');

    const result = {};
    for (const elem of elementsConfig.elements) {
      const value = await parseElement(page, elem);
      result[elem.name] = value;
    }

    return result;
  } finally {
    await browser.close();
  }
}

async function parseElement(page, elem) {
  const { selector, attribute, regex, parts, separator } = elem;
  const element = await page.$(selector);
  if (!element) return null;

  const text = await element.evaluate((el, attr) => el[attr], attribute || 'textContent');
  if (parts) {
    return parts.map(part => text.match(new RegExp(part.regex))[0]).join(separator);
  }
  return text.match(new RegExp(regex))[0];
}

module.exports = { scrapePlayerData };