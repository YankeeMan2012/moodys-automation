const puppeteer = require('puppeteer');

const selector = (testId) => `[data-testid="${testId}"]`;

const auth = async () => {
  const browser = await puppeteer.launch({ headless: +process.env.HEADLESS });
  const page = await browser.newPage();

  await page.goto(`${process.env.SITE}/search?keyword=aapl`);

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  //
  // // Type into search box
  const email = selector('emailInput');
  await page.waitForSelector(email);
  await page.type(email, process.env.EMAIL);

  const continueBtn = selector('emailContinueButton');
  await page.click(continueBtn);

  const password = selector('password');
  await page.waitForSelector(password);
  await page.type(password, process.env.PASSWORD);

  const login = selector('loadingButton');
  await page.click(login);

  await page.waitForSelector('.search-input');

  const cookies = await page.cookies();

  const authCookie = cookies.find(c => c.name === process.env.AUTH_COOKIE);
  await browser.close();

  return authCookie;
};

module.exports = {
  auth,
}
