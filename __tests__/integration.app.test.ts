import { expect, test, afterAll, beforeAll } from "@jest/globals";
import { Browser, Page, launch } from "puppeteer";

let browser: Browser | undefined;
let page: Page | undefined;

const sleep = async (ms: number) =>
  await new Promise((res) => setTimeout(res, ms));

beforeAll(async () => {
  browser = await launch({
    headless: false,
  });
  if (!browser) {
    throw new Error("browser not launched");
  }
  page = await browser.newPage();

  await page.goto("http://localhost:5173");
}, 30_000);
test("Viewer Control binds to correct host", async () => {
  await sleep(1_000);

  if (!page) {
    throw new Error("Error while loading Puppeteer page");
  }

  // const btn = await page.$("button");
  // if (!btn) {
  //   throw new Error("Can't find the increase counter button");
  // }

  // const CLICK_TIMES = 10;
  // for (let i = 0; i < CLICK_TIMES; i++) {
  //   btn.click();
  //   await sleep(250);
  // }

  // const counterSpan = await page.$("#counter");
  // if (!counterSpan) {
  //   throw new Error("Can't find the counter span");
  // }
  // const counterSpanValue = await counterSpan.evaluate(
  //   (el: HTMLSpanElement) => el.innerText
  // );
  const hostIdSpan = await page.$("#host-id-span");
  if (!hostIdSpan) {
    const body = await page.$("body");
    const text = await (await body?.getProperty("innerText"))?.jsonValue;
    console.log(text);
    throw new Error("Can't find the counter span");
  }
  // const hostIdSpanValue = await hostIdSpan.evaluate(
  //   (el: HTMLElement) => el.innerText
  // );
  const hostIdSpanValue = await (
    await hostIdSpan.getProperty("innerText")
  ).jsonValue();

  expect(hostIdSpanValue).toBe("viewer-host");
}, 30_000);

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});
