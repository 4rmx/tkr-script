const AWS = require('aws-sdk');

const DO_TOKEN = process.env.DO_TOKEN;
const DO_KEY = process.env.DO_KEY;
const Bucket = 'tkr';

const space = new AWS.S3({
  endpoint: 'https://sgp1.digitaloceanspaces.com',
  useAccelerateEndpoint: false,
  credentials: new AWS.Credentials(
    DO_TOKEN,
    DO_KEY,
    null
  ),
});

const putFile = async (key, body) => {
  return new Promise((resolve, reject) => {
    space.putObject(
      {
        Bucket,
        Key: key,
        ACL: 'public-read',
        ContentType: 'application/pdf',
        Body: body,
      },
      (error, data) => {
        if (error) {
          reject(error);
        }
        console.log('done - ' + key);
        // return data;
        resolve(data);
      }
    );
  });
};


async function uploadToStorage(id, policyNo, file) {
  const key = 'policy/report/' + id + '/' + policyNo + '.pdf';
  console.log('upload - ' + key);
  return await putFile(key, file);
}

module.exports = uploadToStorage;