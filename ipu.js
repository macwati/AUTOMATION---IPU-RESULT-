let puppeteer = require("puppeteer");
let fs = require("fs");
const { promises } = require("dns");
(async function(){
    let data = await fs.promises.readFile("credentials.json","utf-8");
    let credendials = JSON.parse(data);
    EnrollmentNumber = credendials.EnrollmentNumber;
    Branch = credendials.Branch;


    let browser = await puppeteer.launch({
        headless:true,
        defaultViewport:null,
        args:["--start-maximized"]
    });
    let numberofpages = await browser.pages();
    let tab = numberofpages[0];

    await tab.goto("http://ipuresults.co.in",{waitUntil:"networkidle0"});
    console.log("page opened");
    let enrollmentno = await tab.waitForSelector("#enrolment");
    await tab.type("#enrolment",EnrollmentNumber,{delay:400});
    console.log("enrollment number typed");
    let selectcourse = await tab.waitForSelector(".input-control.select.styled-select.blue.semi-square.block-shadow-info");
    await tab.click(".input-control.select.styled-select.blue.semi-square.block-shadow-info");
    await tab.keyboard.type(Branch);
    await tab.keyboard.press("Enter");
    let getresults = await tab.waitForSelector(".button.warning.block-shadow-warning");
    await Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle2"
    }),tab.click(".button.warning.block-shadow-warning")])
    
    console.log("result showd");

   

    let pagecontent = await tab.$eval("div #wrapper",el => el.innerHTML);
    // console.log(pagecontent);
    await tab.setContent(pagecontent);
    await tab.emulateMedia('screen');
    let pdfFile =  await tab.pdf({path:'./results1.pdf',format:'Letter'})
    console.log(" result successfully downloaded!")
    return pdfFile;
   
})()