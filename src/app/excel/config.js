const headerCell = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
const headerKey = [
  { name: 'no', type: 'v' },
  { name: 'prefix', type: 'w' },
  { name: 'name', type: 'w' },
  { name: 'surename', type: 'w' },
  { name: 'sex', type: 'v' },
  { name: 'bd', type: 'w' },
  { name: 'age', type: 'w' },
  { name: 'nationality', type: 'w' },
  { name: 'pid', type: 'w' },
  { name: 'wpid', type: 'w' },
  { name: 'cid', type: 'w' },
  { name: 'otherwp', type: 'w' },
  { name: 'employer', type: 'w' },
  { name: 'employerId', type: 'w' },
  { name: 'employerPhone', type: 'w' },
  { name: 'employerEmail', type: 'w' },
];

const createHeader = () => {
  let rowCol = {};
  for (let i = 0; i < headerCell.length; i++) {
    const l = headerCell[i];
    const v = headerKey[i];
    rowCol[l] = v;
  }
  return rowCol;
};

module.exports = { headerCell, headerKey, createHeader };