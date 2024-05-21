const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/image', async (req, res) => {
    const { price, issue, condition, quality, title, poster, cgc } = req.query;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const url = `http://localhost:4000/image.html?price=${encodeURIComponent(price)}&issue=${encodeURIComponent(issue)}&condition=${encodeURIComponent(condition)}&quality=${encodeURIComponent(quality)}&title=${encodeURIComponent(title)}&poster=${encodeURIComponent(poster)}&cgc=${encodeURIComponent(cgc)}`;
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

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
