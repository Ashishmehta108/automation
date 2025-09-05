const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // ✅ must be true on Render
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://youtube.com", { waitUntil: "networkidle2" });
    console.log("✅ Opened YouTube in Render worker");

    await new Promise((res) => setTimeout(res, 4000));
    await browser.close();
})();
