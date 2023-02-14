const buildAppXMl = require('../../tipInsurAPI/buildAppXML');
const buildPolicyXML = require('../../tipInsurAPI/buildPolicyXML');
const {
  requestApp,
  requestPolicy,
} = require('../../tipInsurAPI/requesTipInsurance');
const {
  parseAppResposne,
  parsePolicyResposne,
} = require('../../tipInsurAPI/parseXMLResponse');


const process = async (updateColl, row) => {
  try {
    const inserted = await updateColl.insertOne({ ...row });
    const _id = inserted.insertedId;

    // APP
    const appXML = buildAppXMl(_id, row);
    const responseApp = await requestApp(appXML);
    const { requestNo, applicationNo } = await parseAppResposne(
      responseApp.data
    );
    console.log(requestNo);
    console.log(applicationNo);

    await updateColl.updateOne({ _id }, { $set: { requestNo, applicationNo } });

    // Policy
    const policyXML = buildPolicyXML(requestNo, applicationNo);
    console.log(policyXML);
    const responsePolicy = await requestPolicy(policyXML);
    const { policyNo, urlPolicy } = await parsePolicyResposne(
      responsePolicy.data
    );
    console.log(policyNo);
    console.log(urlPolicy);

    await updateColl.updateOne({ _id }, { $set: { policyNo, urlPolicy } });
    // return `${_id.toString()},${policyNo},${urlPolicy}`;
    return { id: _id.toString(), policyNo, urlPolicy };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const requestAPI = async (jsonObj, updateColl) => {
  try {
    const array = [];
    for (let i = 0; i < jsonObj.length; i++) {
      const row = jsonObj[i];
      const result = await process(updateColl, row);
      array.push(result);
    }
    return array;
  } catch (err) {
    throw err;
  }
};
module.exports = requestAPI;