const puppeteer = require('puppeteer');
// const downloadScript = require('./downloadScript');
const cheerio = require('cheerio');
// const ytd = require('youtube-dl');

const modules = {
  ABA01: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=532',
    items: []
  },
  ABA02: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=548',
    items: []
  },
  ABA03: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=554',
    items: []
  },
  ABA06: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=560',
    items: []
  },
  ABA04: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=566',
    items: []
  },
  ABA05: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=582',
    items: []
  },
  ABA07: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=780',
    items: []
  },
  ABA08: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=611',
    items: []
  },
  ABA09: {
    url: 'https://abascool.dicampus.es/course/view.php?id=11&sectionid=622',
    items: []
  },
};


// moduleName/moduleItem/fileName;

(async () => {
    const dalvaLogin = 'dalvamffernandes@gmail.com'
    const dalvaPassword = 'afonsoetereza88*'
    const websiteLoginURL = "https://abascool.dicampus.es/login/index.php"

    const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(websiteLoginURL);
  
  //login
  await page.type('input#username', dalvaLogin)
  await page.type('input#password', dalvaPassword)
  await page.click('#loginbtn');
  await page.waitForTimeout(5000);

  const modulesIt = Object.keys(modules)

  while(modulesIt.length){
    const module = modulesIt.pop();
    await page.goto(modules[module].url);
    const $ = cheerio.load(await page.content())
    $('h3.sectionname a').each((idx, elem) => {
      const $elem = $(elem);
      const text = $elem.text().split(/(\d[\.]\d{1,2})./)
      modules[module].items.push({
        unitNumber: text[0] + text[1],
        unitName: text[2],
        unitUrl: $elem.attr('href'),
      })
    });
  }


  const fs = require('fs');
  fs.writeFile('helloworld.json', JSON.stringify(modules), function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
    
   
  // Object.keys(modules).forEach((moduleName) => {
  //   console.log(item)
  // })
  //Loop modules


  //Access course
  // const page2 = await browser.newPage();
  // await page2.goto('https://player.vimeo.com/video/359268277')

  // page2.setRequestInterception(true)
  // page2.click('button.play')
  // page2.on('request', async (req) => {
  //     if(req.url().includes('master.json')){
  //         console.log(req.url())
  //         await browser.close();
  //     }
  // })
})();