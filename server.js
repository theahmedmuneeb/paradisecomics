const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.get('/image', async (req, res) => {
    const { price, issue, condition, quality } = req.query;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `http://localhost:3000/image.html?price=${encodeURIComponent(price)}&issue=${encodeURIComponent(issue)}&condition=${encodeURIComponent(condition)}&quality=${encodeURIComponent(quality)}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    const cardSelector = '#image';
    await page.waitForSelector(cardSelector);
    const cardElement = await page.$(cardSelector);
    const boundingBox = await cardElement.boundingBox();
    await page.setViewport({
        width: Math.ceil(boundingBox.width),
        height: Math.ceil(boundingBox.height),
        deviceScaleFactor: 2 // quality control
    });
    const screenshot = await cardElement.screenshot({
        type: 'jpeg', 
        quality: 100, 
        omitBackground: true 
    });
    await browser.close();
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
});
app.use(express.static('.'));
app.listen(3000, () => {
    console.log('Server is running');
});
