const puppeteer = require("puppeteer");
const fs = require("fs");
const ejs = require("ejs");
const logo = fs.readFileSync("./src/template/Hatlogo.PNG").toString("base64");

exports.pdfConverter = async (information, pdfPath, templatePath) => {
  // Create browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Get HTML content
  const html = ejs2html(information, templatePath); //fs.readFileSync('./sample.html', 'utf-8');

  // Set HTML as page content
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // Save PDF File
  await page.pdf({
    path: pdfPath || "./src/template/result_from_html.pdf",
    format: "LEDGER",
    printBackground: true,
  });

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

  return de;
}
