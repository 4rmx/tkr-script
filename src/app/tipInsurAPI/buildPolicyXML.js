const xml2js = require('xml2js');

const TIP_USR = process.env.TIP_USR;
const TIP_PWD = process.env.TIP_PWD;

const string = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:cor="http://schemas.datacontract.org/2004/07/CoreService.Entity">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:RequestPolicy>
         <!--Optional:-->
         <tem:request>
            <cor:RequestNo>$$$1</cor:RequestNo>
            <cor:AgenCode>${TIP_USR}</cor:AgenCode>
            <cor:AgenPassword>${TIP_PWD}</cor:AgenPassword>
            <cor:ActionCode>HA002</cor:ActionCode>
            <cor:ApplicationNo>$$$2</cor:ApplicationNo>
            <!--Optional:-->
            <cor:RefID>?</cor:RefID>
            <!--Optional:-->
            <cor:FlagEmail>?</cor:FlagEmail>
         </tem:request>
      </tem:RequestPolicy>
   </soapenv:Body>
</soapenv:Envelope>
`;

const buildPolicyXML = (requestNo, applicationNo) => {
  let obj = {
    'soapenv:Envelope': {
      $: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:tem': 'http://tempuri.org/',
        'xmlns:cor':
          'http://schemas.datacontract.org/2004/07/CoreService.Entity',
      },
      'soapenv:Header': [''],
      'soapenv:Body': [
        {
          'tem:RequestPolicy': [
            {
              'tem:request': [
                {
                  'cor:RequestNo': [' '],
                  'cor:AgenCode': ['TKRBROKER'],
                  'cor:AgenPassword': ['!qaz@wsxP'],
                  'cor:ActionCode': ['HA002'],
                  'cor:ApplicationNo': [' '],
                  'cor:RefID': [''],
                  'cor:FlagEmail': [''],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const builder = new xml2js.Builder();

  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestPolicy'][0][
    'tem:request'
  ][0]['cor:RequestNo'] = requestNo;
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestPolicy'][0][
    'tem:request'
  ][0]['cor:ApplicationNo'] = applicationNo;

  return builder.buildObject(obj);
};

module.exports = buildPolicyXML;
