require('dotenv').config();
const db = require('../db');
const fs = require('fs');
const streamToBuffer = require('./util/streamToBuffer');
const { getPolicyPDF } = require('../tipInsurAPI/requesTipInsurance');
const upload = require('../storage/uploadToStorage');
const pbcopy = require('./util/pbCopy');
const { ObjectId } = require('mongodb');

const id = '63eb10064019b2d595d487a7';

(async function main() {
  try {

    await db.connect();
    const results = await db.coll('insurance').find({ _id: { $gte: new ObjectId(id) } }).toArray();
    for (let i = 0; i < results.length; i++) {
      const curr = results[i];
      const { policyNo, urlPolicy } = curr;
      const responsePDF = await getPolicyPDF(urlPolicy);
      const pdfBuffer = await streamToBuffer(responsePDF.data);
      await upload(id, policyNo, pdfBuffer);
      fs.appendFileSync('report.txt', `https://tkr.sgp1.cdn.digitaloceanspaces.com/policy/report/${id}/${policyNo}.pdf` + '\n');
    }
    const report = fs.readFileSync('report.txt');
    pbcopy(report);
    await db.close();
  } catch (error) {
    console.log(error);
  }
})();
