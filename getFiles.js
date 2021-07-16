const puppeteer = require("puppeteer");
const file = require("./helloworld.json");
const cheerio = require("cheerio");

(async () => {
  const dalvaLogin = "dalvamffernandes@gmail.com";
  const dalvaPassword = "afonsoetereza88*";
  const websiteLoginURL = "https://abascool.dicampus.es/login/index.php";

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(websiteLoginURL);

  //login
  await page.type("input#username", dalvaLogin);
  await page.type("input#password", dalvaPassword);
  await page.click("#loginbtn");
  await page.waitForTimeout(5000);

  const modulesIt = Object.keys(file);

  while (modulesIt.length) {
    const current = modulesIt.pop();
    const unit = file[current].items[0];
    //acessa url
    await page.goto(unit.unitUrl);
    const $ = cheerio.load(await page.content());
    await page.waitForTimeout(5000);

    //pega URLs dos itens
    $(".iconlarge.activityicon").each(async (idx, lesson) => {
      const $lesson = $(lesson);
      const src = $lesson.attr("src");
      switch (getImageType(src)) {
        case "PDF":
          //baixa
          await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: "/teste",
          });
          const parentURL = $lesson.parent().attr("href");
          await page.click(`[href='${parentURL}']`);
          break;
        case "VIDEO":
          console.log($lesson.parent().attr("src"));
          break;
      }
    });
    await page.waitForTimeout(30000);
  }
})();

function getImageType(src) {
  if (src.includes("pdf-24")) {
    return "PDF";
  } else if (src.includes("icon")) {
    return "VIDEO";
  } else {
    return "TEST";
  }
}
