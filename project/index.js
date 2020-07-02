
// function でまとめる
// みている時間が分からないため、
// unsafe_download()
// const { execSync } = require('child_process')
// var validator = require('validator');
var fs = require('fs');
var path = require('path');
// var readline = require('readline');
const puppeteer = require('puppeteer');
const MongoClient = require("mongodb").MongoClient;
 
// 接続文字列
const uri = "mongodb://localhost/sampledb";

const client = new MongoClient(uri, { useNewUrlParser: true });

const environment = "test"

// var rs = fs.createReadStream(path.join(__dirname,'data','list.txt'));

// var rl = readline.createInterface(rs, {});

// rl.on('line', function(line) {
//     if(validator.isURL(line)){
//         const stdout = execSync(['youtube-dl','-o', "'" + path.join(__dirname,'data','output','%(title)s.%(ext)s') + "'",line].join(' '))
//         console.log(`stdout: ${stdout.toString()}`)

//     }

// });

if (process.env.PUPPETEER_USERNAME == null || process.env.PUPPETEER_PASSWORD == null) {
  console.log("you must input environment variable PUPPETEER_USERNAME and PUPPETEER_PASSWORD")
  process.exit(1)
}

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  const navigationPromise = page.waitForNavigation()
  // ログイン画面に移動
  await page.goto('https://secure.golden-gateway.com/sites/affid/user/index.php')
  
  await page.setViewport({ width: 1440, height: 637 })
  
  // 描画を待ったのちuser名、パスワードを入力
  await page.waitForSelector('.contact > tbody > tr:nth-child(1) > td > input')
  await page.type('input[name="affid"]', process.env.PUPPETEER_USERNAME);
  await page.waitForSelector('.contact > tbody > tr:nth-child(2) > td > input')
  await page.type('input[name="password"]', process.env.PUPPETEER_PASSWORD);

  // ログインボタンをクリック
  await page.waitForSelector('.sendbox > .form_btn > ul > li > .btn01')
  await page.click('.sendbox > .form_btn > ul > li > .btn01')
  
  await navigationPromise
  
  await page.waitForSelector('.js-hiraku-offcanvas-body > #gnavi > .menu > .menu__mega:nth-child(3) > .init-bottom')
  await page.click('.js-hiraku-offcanvas-body > #gnavi > .menu > .menu__mega:nth-child(3) > .init-bottom')
  
  // リンククリックにより移動広告作成に移動
  //await page.waitForSelector('.menu > .menu__mega:nth-child(3) > .menu__second-level > li:nth-child(3) > a')
  //await page.click('.menu > .menu__mega:nth-child(3) > .menu__second-level > li:nth-child(3) > a')
  await page.goto('https://secure.golden-gateway.com/sites/affid/user/direct_link.php')
  await navigationPromise

  // セレクトボックスをクリックしてイチゴキャンディを選択
  await page.waitForSelector('.cntBox > form > .d_link > dd > select')
  await page.click('.cntBox > form > .d_link > dd > select')
  await page.select('.cntBox > form > .d_link > dd > select', '002')

  await navigationPromise

  // ここからループ listurl {url: img:}
  //// textboxに貼り付け
  await page.waitForSelector('.cntBox > form > .d_link > dd > input')
  // await page.click('.cntBox > form > .d_link > dd > input')
  
  await page.type('input[name="other_url"]', "");

  await navigationPromise

  //// 広告作成ボタンをクリック
  await page.waitForSelector('#main > .cntBox > form > .d_link > .btn01')
  await page.click('#main > .cntBox > form > .d_link > .btn01')
  
  await navigationPromise

  // textareaが描画されるまで待つ
  await page.waitFor('textarea[name="frm_src"]');
  
  url = await page.$eval('textarea[name="frm_src"]', item => {
    return item.textContent;
  });

  console.log(await url)
  client.connect(err => {
    const collection = client.db(environment).collection("links");

    collection.insertOne({affiliateurl: await url})
    // perform actions on the collection object
    client.close();
  });
  // //// 作成したurlコピー
  // await page.waitForSelector('.cntBox > form > .inner > .inner > .btn02')
  // await page.click('.cntBox > form > .inner > .inner > .btn02')

  // PDF作成処理
  await page.pdf({
    path: path.join(process.env.PUPPETEER_DATA,'google_top.pdf'),
  });

  //// 値からhtmlを作成 
  // ここまで

  await browser.close()
})()