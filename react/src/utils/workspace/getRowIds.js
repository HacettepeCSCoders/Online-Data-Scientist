export default (dataDetails) => {
  let rowArr = [];
  const rows = dataDetails.split("\n");
  for (let i = 0; i < rows.length - 2; i++) {
    rowArr.push(i);
  }
  return rowArr;
};
