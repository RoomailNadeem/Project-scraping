const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  const imageUrls = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).map(img => img.src);
  });
  await Promise.all(imageUrls.map(url => {
    const fileName = url.split('/').pop();
    return page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './images'});
    return page.goto(url, {waitUntil: 'networkidle2'});
  }));
  await browser.close();
})();
