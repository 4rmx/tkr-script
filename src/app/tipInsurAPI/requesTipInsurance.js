const axios = require('axios').default;

const PROXY_URL = process.env.PROXY_URL;
const PROXY_USR = process.env.PROXY_USR;
const PROXY_PWD = process.env.PROXY_PWD;

const proxy = {
  protocol: 'http',
  host: PROXY_URL,
  port: 3128,
  auth: {
    username: PROXY_USR,
    password: PROXY_PWD,
  },
};

const requestApp = (xml) => {
  const config = {
    method: 'post',
    url: 'https://api.tipinsure.com/TAPolicyWS/Service.svc',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      soapAction: '"http://tempuri.org/IService/RequestApp"',
    },
    data: xml,
    proxy,
  };
  return axios(config);
};

const requestPolicy = (xml) => {
  const config = {
    method: 'post',
    url: 'https://api.tipinsure.com/TAPolicyWS/Service.svc',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      soapAction: '"http://tempuri.org/IService/RequestPolicy"',
    },
    data: xml,
    proxy,
  };
  return axios(config);
};

const getPolicyPDF = (url) => {
  return axios({
    method: 'get',
    url,
    responseType: 'stream',
    proxy,
    timeout: 5000,
  });
};

module.exports = { requestApp, requestPolicy, getPolicyPDF };

