const { parse, isValid, isBefore } = require('date-fns');
const { th } = require('date-fns/locale');

const currentDate = new Date();
const dateValidate = (rawDate) => {
  const parsedDate = parse(rawDate, 'dd/MM/yyyy', currentDate, { locale: th });
  return isValid(parsedDate) && isBefore(parsedDate, currentDate);
};

module.exports = dateValidate;
