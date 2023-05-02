const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    executablePath: 'https://www.google.com/',
    headless: "new"
  });

  const page = await browser.newPage();
  await page.goto('https://sol-testing.webflow.io/');
  const imageUrls = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).map(img => img.src);
  });

  await Promise.all(imageUrls.map(async url => {
    const fileName = url.split('/').pop();
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './images'});
    await page.goto(url, {waitUntil: 'networkidle2'});
  }));

  await browser.close();
})();
