const puppeteer = require("puppeteer");
const fs = require("fs");


(async () => {
    // 1. Load data from file (CSV simple split)


    const browser = await puppeteer.launch({
        executablePath: "/usr/bin/google-chrome", // use Render's Chrome
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    });
    const page = await browser.newPage();

    await page.goto("http://youtube.com")
    console.log("done ")

    await browser.close();
})();