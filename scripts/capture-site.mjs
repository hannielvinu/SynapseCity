import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const routes = [
    "/",
    "/live-traffic",
    "/digital-twin",
    "/analytics",
    "/ai-agents",
    "/predictions",
    "/emergency",
    "/citizen-reports",
    "/architecture",
];

const viewports = {
    desktop: {
        width: 1440,
        height: 900,
    },
    mobile: {
        width: 390,
        height: 844,
    },
};

const outputRoot = path.resolve("website-audit");

fs.rmSync(outputRoot, { recursive: true, force: true });

for (const type of Object.keys(viewports)) {
    fs.mkdirSync(path.join(outputRoot, type), { recursive: true });
}

const browser = await chromium.launch();

async function waitForPage(page) {
    await page.waitForLoadState("networkidle").catch(() => { });

    // Give React/WebSocket-driven UI time to settle.
    await page.waitForTimeout(2500);

    // Trigger lazy-loaded content.
    await page.evaluate(async () => {
        const maxScroll = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );

        const step = Math.max(window.innerHeight * 0.8, 400);

        for (let y = 0; y < maxScroll; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        window.scrollTo(0, 0);
    });

    await page.waitForTimeout(1000);
}

async function expandScrollableContainers(page) {
    await page.evaluate(() => {
        const elements = document.querySelectorAll("*");

        for (const el of elements) {
            const style = window.getComputedStyle(el);

            const isScrollableY =
                (style.overflowY === "auto" ||
                    style.overflowY === "scroll" ||
                    style.overflowY === "overlay") &&
                el.scrollHeight > el.clientHeight + 10;

            const isScrollableX =
                (style.overflowX === "auto" ||
                    style.overflowX === "scroll" ||
                    style.overflowX === "overlay") &&
                el.scrollWidth > el.clientWidth + 10;

            if (isScrollableY || isScrollableX) {
                el.dataset.auditOriginalHeight = el.style.height;
                el.dataset.auditOriginalMaxHeight = el.style.maxHeight;
                el.dataset.auditOriginalOverflow = el.style.overflow;
                el.dataset.auditOriginalOverflowY = el.style.overflowY;
                el.dataset.auditOriginalOverflowX = el.style.overflowX;

                if (isScrollableY) {
                    el.style.height = `${el.scrollHeight}px`;
                    el.style.maxHeight = "none";
                    el.style.overflowY = "visible";
                }

                if (isScrollableX) {
                    el.style.width = `${el.scrollWidth}px`;
                    el.style.maxWidth = "none";
                    el.style.overflowX = "visible";
                }

                el.style.overflow = "visible";
            }
        }

        // Remove sticky/fixed positioning temporarily so full-page
        // captures don't duplicate floating elements over the page.
        for (const el of document.querySelectorAll("*")) {
            const style = window.getComputedStyle(el);

            if (style.position === "sticky") {
                el.dataset.auditOriginalPosition = el.style.position;
                el.style.position = "static";
            }
        }
    });

    await page.waitForTimeout(500);
}

function routeName(route) {
    if (route === "/") return "home";

    return route
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-");
}

for (const [device, viewport] of Object.entries(viewports)) {
    console.log(`\n=== ${device.toUpperCase()} ===`);

    for (const route of routes) {
        const name = routeName(route);
        const output = path.join(outputRoot, device, `${name}.png`);

        console.log(`Capturing ${route}`);

        const context = await browser.newContext({
            viewport,
            deviceScaleFactor: 1,
            isMobile: device === "mobile",
        });

        const page = await context.newPage();

        page.on("console", (msg) => {
            if (msg.type() === "error") {
                console.log(`  [console error] ${msg.text()}`);
            }
        });

        try {
            await page.goto(`${BASE_URL}${route}`, {
                waitUntil: "domcontentloaded",
                timeout: 30000,
            });

            await waitForPage(page);

            await expandScrollableContainers(page);

            await page.screenshot({
                path: output,
                fullPage: true,
            });

            console.log(`  ✓ ${output}`);
        } catch (error) {
            console.error(`  ✗ Failed: ${route}`);
            console.error(`    ${error.message}`);
        }

        await context.close();
    }
}

await browser.close();

console.log("\n=================================");
console.log("Screenshot capture complete.");
console.log(`Output: ${outputRoot}`);
console.log("=================================");