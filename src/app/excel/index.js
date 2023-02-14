require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { excelToJson } = require('./util/xlsToJson');
const buildAppXML = require('../tipInsurAPI/buildAppXML');
const makeQuestion = require('../promt/makeQuestion');
const db = require('../db');
const requestAPI = require('./util/requestAPI');
const streamToBuffer = require('./util/streamToBuffer');
const { getPolicyPDF } = require('../tipInsurAPI/requesTipInsurance');
const upload = require('../storage/uploadToStorage');
const pbcopy = require('./util/pbCopy');

async function main() {
  try {
    const pathToXls = path.join(__dirname, '../../../MG738471_250.xlsx');
    const docRef = 'MG738471_250';
    /**
     * PATH 1
     * parse excel to json
     */
    const jsonObj = await excelToJson(pathToXls, docRef);
    let focusIndex = 0;
    while (true) {
      console.table(jsonObj[focusIndex]);
      console.log(buildAppXML('mockId1234', jsonObj[focusIndex]));
      console.log(`Please verify information of (${jsonObj.length}) employee.`);
      const resultPart1 = await makeQuestion('Are you sure you want to continue to reqeust app? [Y/n]: ');
      const matchNumber = resultPart1.match(/\d+/g);
      if (matchNumber) {
        const number = Number(matchNumber[0]);
        focusIndex = number - 1;
      } else {
        const matchLetter = resultPart1.match(/[a-zA-Z]+/g);
        if (matchLetter) {
          const letter = matchLetter[0].toLowerCase();
          if (letter === 'y') {
            break;
          } else {
            return;
          }
        }
      }
    }

    /**
     * PART 2
     * requst tipinsur api and update to db
     */
    await db.connect();
    const responseArray = await requestAPI(jsonObj, db.coll('insurance'));

    /**
     * PART 3
     * download pdf and upload to storage
     */
    fs.writeFileSync('report.txt', '');
    for (let i = 0; i < responseArray.length; i++) {
      const resp = responseArray[i];
      const { id, policyNo, urlPolicy } = resp;
      const responsePDF = await getPolicyPDF(urlPolicy);
      const pdfBuffer = await streamToBuffer(responsePDF.data);
      await upload(id, policyNo, pdfBuffer);
      fs.appendFileSync('report.txt', `https://tkr.sgp1.cdn.digitaloceanspaces.com/policy/report/${id}/${policyNo}.pdf` + '\n');
    }
    const report = fs.readFileSync('report.txt');
    pbcopy(report);
    await db.close();
  } catch (err) {
    console.log(err);
  }
}

main();