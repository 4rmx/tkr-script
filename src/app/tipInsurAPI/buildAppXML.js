const xml2js = require('xml2js');
const { format, addDays } = require('date-fns');
const TIP_USR = process.env.TIP_USR;
const TIP_PWD = process.env.TIP_PWD;

const buildAppXMl = (_id, employee) => {
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
          'tem:RequestApp': [
            {
              'tem:request': [
                {
                  'cor:CountryName': [''],
                  'cor:PlanCode': ['IHA7806M'],
                  'cor:PolicyUnit': ['Y'],
                  'cor:PolicyType': ['I'],
                  'cor:PolicyDate': ['02/02/2023'],
                  'cor:ExpiryDate': ['01/08/2023'],
                  'cor:NumberPerson': ['1'],
                  'cor:NetAmount': ['990'],
                  'cor:Amount': ['986'],
                  'cor:CustomerType': ['P'],
                  'cor:CustomerPrefix': ['MR.'],
                  'cor:CustomerName': ['TKRBROKER'],
                  'cor:CustomerSureName': [' '],
                  'cor:CompanyName': [''],
                  'cor:CardType': ['P'],
                  'cor:IdCard': [''],
                  'cor:Email': [' '],
                  'cor:Phone': [' '],
                  'cor:InsurerList': [
                    {
                      'cor:Insurer': [
                        {
                          'cor:InsurePrefix': ['MISS'],
                          'cor:InsureName': ['YA MIN SOE'],
                          'cor:InsureSurName': [' '],
                          'cor:CardType': ['P'],
                          'cor:IdCard': ['6656360561386'],
                          'cor:BirthDate': ['04/09/1999'],
                          'cor:Email': [''],
                          'cor:Phone': [''],
                          'cor:Nominee': [''],
                          'cor:Relationship': [''],
                          'cor:AddressList': [
                            {
                              'cor:Address': [
                                {
                                  'cor:Address1': [
                                    '9/19 ซอยนวมินทร์ 36 ถนนนวมินทร์',
                                  ],
                                  'cor:Address2': [''],
                                  'cor:Address3': [''],
                                  'cor:Address4': [''],
                                  'cor:District': ['คลองกุ่ม'],
                                  'cor:Area': ['บึงกุ่ม'],
                                  'cor:Province': ['กรุงเทพมหานคร'],
                                  'cor:Zipcode': ['10240'],
                                },
                              ],
                            },
                          ],
                          'cor:Occupation': [''],
                        },
                      ],
                    },
                  ],
                  'cor:RefID': ['HA-TH-60882'],
                  'cor:RequestNo': ['RQ2018082400045'],
                  'cor:AgenCode': [TIP_USR],
                  'cor:AgenPassword': [TIP_PWD],
                  'cor:ActionCode': ['HA001'],
                  'cor:DeliveryType': [''],
                  'cor:TaxDeductionFlag': ['N'],
                  'cor:TaxDeductionID': [''],
                  'cor:QuestionnaireList': [
                    {
                      'cor:Questionnaire': [
                        {
                          'cor:QuestFlag': ['N'],
                          'cor:QuestDesc1': [''],
                          'cor:QuestDesc2': [''],
                        },
                      ],
                    },
                  ],
                  'cor:PreviousPolicyNo': [''],
                  'cor:BrokerBranchCode': [''],
                  'cor:BrokerBranchName': [''],
                  'cor:ChannelBranchCode': [''],
                  'cor:ChannelBranchName': [''],
                  'cor:PostPrefix': [''],
                  'cor:PostName': [''],
                  'cor:PostSurName': [''],
                  'cor:PostAddress1': [''],
                  'cor:PostAddress2': [''],
                  'cor:PostAddress3': [''],
                  'cor:PostAddress4': [''],
                  'cor:PostDistrict': [''],
                  'cor:PostArea': [''],
                  'cor:PostProvince': [''],
                  'cor:PostZipCode': [''],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const builder = new xml2js.Builder();
  const thisDay = new Date();

  // formatter
  const surename = employee?.surename ? ` ${employee.surename}` : '';
  const fullname = employee.name + surename;
  const idCard = employee?.pid ? employee.pid : employee?.wpid ? employee.wpid : employee?.cid ? employee.cid : employee.otherwp;

  if (!idCard) {
    throw new Error('invalid id');
  }

  // PolicyDate
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:PolicyDate'] = format(thisDay, 'dd/MM/yyyy');

  // ExpiryDate
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:ExpiryDate'] = format(addDays(thisDay, 180), 'dd/MM/yyyy');

  // CustomerPrefix
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:CustomerPrefix'] = employee.prefix;

  // CustomerName
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:CustomerName'] = fullname;

  // CustomerSureName
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:CustomerSureName'] = owner.lastname;

  // CompanyName
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:CompanyName'] = owner.company;

  // IdCard
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:IdCard'] = idCard;

  // Email
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:Email'] = owner.username;

  // Phone
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:Phone'] = owner.phoneNumber;

  // RequestNo
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:RequestNo'] = _id.toString().slice(0, 15);

  /**
   * employee
   */
  // InsurePrefix
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:InsurePrefix'] =
    employee.prefix;

  // InsureName
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:InsureName'] = fullname;

  // IdCard
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:IdCard'] = idCard;

  // BirthDate
  obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
    'tem:request'
  ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:BirthDate'] = employee.bd;

  // Address1
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:Address1'] = '9/19 ซอยนวมินทร์ 36 ถนนนวมินทร์';

  // Address2
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:Address2'] = owner.addressLine2;

  // District
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:District'] = 'บึงกุ่ม';

  // Area
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:Area'] = 'คลองกุ่ม';

  // Province
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:Province'] = 'กรุงเทพ ฯ';

  // Zipcode
  // obj['soapenv:Envelope']['soapenv:Body'][0]['tem:RequestApp'][0][
  //   'tem:request'
  // ][0]['cor:InsurerList'][0]['cor:Insurer'][0]['cor:AddressList'][0][
  //   'cor:Address'
  // ][0]['cor:Zipcode'] = '10240';

  return builder.buildObject(obj);
};

module.exports = buildAppXMl;
