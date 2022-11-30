const puppeteer = require("puppeteer");
const fs = require("fs");
const ejs = require("ejs");
// const logo = fs.readFileSync("./src/template/Hatlogo.PNG").toString("base64");

exports.pdfConverter = async (information, pdfPath, templatePath) => {
  // Create browser instance
  const browser = await puppeteer.launch({headless: true, args:['--no-sandbox'], ignoreHTTPSErrors: true});

  // Create a new page
  const page = await browser.newPage();

  // Get HTML content
  const html = ejs2html(information, templatePath); //fs.readFileSync('./sample.html', 'utf-8');
  // console.log(html)
  // Set HTML as page content
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // Save PDF File
const datasavepdf =   await page.pdf({
    path: "./public"+pdfPath || "./src/template/result_from_html.pdf",
    // format: "LEDGER",
    format: 'A4',
    margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
    }, 
    printBackground: true,
    preferCSSPageSize: true
  });
  // console.log(datasavepdf)

  // Close browser instance
  await browser.close();
};

function ejs2html(information, templatePath) {
  const data = fs.readFileSync(
    templatePath || "./src/template/pdfTemplate.ejs",
    "utf8"
  );
  var ejs_string = data,
    template = ejs.compile(ejs_string),
    de = template(information);
    // console.log(de)
  return de;
}
