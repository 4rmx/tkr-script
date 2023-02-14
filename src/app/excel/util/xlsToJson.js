
const { readFile } = require('xlsx');
const { createHeader } = require('../config');
const dateValidate = require('./dateValidate');

const headers = createHeader();

const excelToJson = async (pathToXls, docRef) => {
  try {

    const wb = readFile(pathToXls);

    const ws_raw = wb.Sheets[wb.SheetNames[0]];
    let ws = ws_raw;
    delete ws['!ref'];
    delete ws['!margins'];
    delete ws['!merges'];

    const len = Number(Object.keys(ws)[Object.keys(ws).length - 1].match(/\d+/g)[0]);
    const array = [];

    for (let i = 4; i < len + 1; i++) {
      let obj = {};
      for (const key in headers) {
        const raw = ws[key + i];
        const Objkey = headers[key]['name'];
        if (raw) {
          if (key === 'G') {
            // check valid date
            const rawValue = raw[headers[key]['type']];
            const value = rawValue.toString().trim();
            if (dateValidate(rawValue)) {
              obj[Objkey] = value;
            } else {
              throw new Error('date is not valid - ' + value);
            }
          } else if (['J', 'K', 'L', 'M', 'O', 'P'].includes(key)) {
            // check number format to string
            const rawId = raw[headers[key]['type']];
            const id = rawId.replace('$', '').replace(/ /g, '');
            obj[Objkey] = id.toString().trim();
          } else {
            const value = raw[headers[key]['type']];
            obj[Objkey] = value.toString().trim();
          }
        } else {
          obj[Objkey] = null;
        }
      }
      array.push({ ...obj, docRef });
    }
    return array;
  } catch (err) {
    throw err;
  }
};

module.exports = { excelToJson };