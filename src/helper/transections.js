const puppeteer = require("puppeteer");
const fs = require("fs");
const ejs = require("ejs");
// const logo = fs.readFileSync("./src/template/Hatlogo.PNG").toString("base64");
exports.pdfConverter2 = async (information, pdfPath, templatePath) => {
  console.log("inside")
  // Create browser instance
  const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});

  // Create a new page
  const page = await browser.newPage();

  // Get HTML content 
  const html = ejs2html2(information, templatePath); //fs.readFileSync('./sample.html', 'utf-8');
 

  // Set HTML as page content
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // Save PDF File
  const datasavepdf =   await page.pdf({
      path: "./public"+pdfPath  || "./src/transection/result_from_html.pdf",
      format: "LEDGER", 
      printBackground: true,
    });
    console.log(datasavepdf)

  // Close browser instance
  await browser.close();
};

function ejs2html2(information, templatePath) {
  const data = fs.readFileSync(
    templatePath || "./src/template/transection.ejs",
    "utf8"
  );
  var ejs_string = data,
    template = ejs.compile(ejs_string),
    de = template(information);

  return de;
}
