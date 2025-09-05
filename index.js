const puppeteer = require("puppeteer"); // full puppeteer

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/", { waitUntil: "networkidle2" });

    const query = "puppeteer tutorial";
    await page.type("input.yt-searchbox-input", query);
    await page.keyboard.press("Enter");

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

    console.log("🔎 Search Results:");
    console.table(results);

    await browser.close();
})();
