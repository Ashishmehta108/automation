const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

const functionmain = async () => {
    const query =  "puppeteer tutorial";


    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/", { waitUntil: "networkidle2" });

    // Wait for the search input and type the query
    await page.type("input#search", query);
    await page.keyboard.press("Enter");

    // Wait for results
    await page.waitForSelector("ytd-video-renderer", { timeout: 10000 });

    const results = await page.evaluate(() => {
        const videos = [];
        document.querySelectorAll("ytd-video-renderer").forEach((el, i) => {
            if (i < 5) {
                const title = el.querySelector("#video-title")?.innerText || "No title";
                const url = el.querySelector("#video-title")?.href || "No link";
                videos.push({ title, url });
            }
        });
        return videos;
    });

    await browser.close();

}

functionmain()


// Root route
app.get("/", (req, res) => {
    res.send("Use /search?q=your+query to search YouTube");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
