const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    // 1. Load data from file (CSV simple split)
    const data = fs.readFileSync("test.csv", "utf8").trim().split("\n");

    const browser = await puppeteer.launch({
        // if running locally, you can remove `executablePath`
        executablePath: "/usr/bin/google-chrome", // works on Render if Chrome is installed
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    });

    const page = await browser.newPage();

    for (let i = 1; i < data.length; i++) { // skip header row
        const [mobile, description] = data[i].split(",");

        if (!mobile || !description) continue; // skip empty lines

        // 2. Open form page
        await page.goto("https://example.com/form", { waitUntil: "networkidle2" });

        // 3. Fill form
        await page.type("textarea[class='pledge-input']", description.trim());
        await page.type("input[class='phone-input']", mobile.trim());

        // Check the "terms" checkbox if not already checked
        const checkbox = await page.$("input[id='terms']");
        if (checkbox) {
            const isChecked = await (await checkbox.getProperty("checked")).jsonValue();
            if (!isChecked) await checkbox.click();
        }

        // 4. Submit form
        await page.click(".submit-btn");

        // 5. Wait a little before next submission
        await new Promise((res) => setTimeout(res, 4000));
    }

    await browser.close();
})();
