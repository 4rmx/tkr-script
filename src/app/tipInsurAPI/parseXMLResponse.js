const xml2js = require('xml2js');
const parseString = xml2js.parseString;

const parseAppResposne = (data) => {
  return new Promise((resolve, reject) => {
    parseString(data, (err, obj) => {
      if (err) {
        reject(err);
      }
      console.log(JSON.stringify(obj, null, 2));
      const status =
        obj['s:Envelope']['s:Body'][0].RequestAppResponse[0]
          .RequestAppResult[0]['a:RequestStatus'];

      if (status[0] !== 'S') {
        throw new Error('resposne error');
      }

      const requestNo =
        obj['s:Envelope']['s:Body'][0].RequestAppResponse[0]
          .RequestAppResult[0]['a:RequestNo'];
      const applicationNo =
        obj['s:Envelope']['s:Body'][0].RequestAppResponse[0]
          .RequestAppResult[0]['a:ApplicationNo'];

      resolve({ requestNo: requestNo[0], applicationNo: applicationNo[0] });
    });
  });
};

const parsePolicyResposne = (data) => {
  return new Promise((resolve, reject) => {
    parseString(data, (err, obj) => {
      if (err) {
        reject(err);
      }
      console.log(JSON.stringify(obj, null, 2));
      const status =
        obj['s:Envelope']['s:Body'][0].RequestPolicyResponse[0]
          .RequestPolicyResult[0]['a:RequestStatus'];
      if (status[0] !== 'S') {
        throw new Error('resposne error');
      }

      const policyNo =
        obj['s:Envelope']['s:Body'][0].RequestPolicyResponse[0]
          .RequestPolicyResult[0]['a:PolicyNo'];
      const urlPolicy =
        obj['s:Envelope']['s:Body'][0].RequestPolicyResponse[0]
          .RequestPolicyResult[0]['a:UrlPolicy'];

      resolve({ policyNo: policyNo[0], urlPolicy: urlPolicy[0] });
    });
  });
};

module.exports = { parseAppResposne, parsePolicyResposne };
