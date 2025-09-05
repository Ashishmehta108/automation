const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // change to false if you want to see browser
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // 1. Go to YouTube
    await page.goto("https://www.youtube.com/", { waitUntil: "networkidle2" });

    // 2. Type search query into input
    const query = "puppeteer tutorial";
    await page.type("input.yt-searchbox-input", query);

    // 3. Press Enter
    await page.keyboard.press("Enter");

    // 4. Wait for results
    await page.waitForSelector("ytd-video-renderer", { timeout: 10000 });

    // 5. Extract first 5 video titles + links
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

    console.log("🔎 Search Results:");
    console.table(results);

    await browser.close();
})();
