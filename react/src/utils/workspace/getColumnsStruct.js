export default (dataDetails) => {
  const rows = dataDetails.split("\n");
  let cols = rows.splice(0, 1)[0];
  cols = cols.split(/,|;/);
  const colArr = cols.map((col, idx) => {
    if (col.indexOf("\r") > -1) {
      col = col.substring(0, col.length - 1);
    }
    const structCol = {
      id: idx,
      name: col,
    };
    return structCol;
  });
  return colArr;
};
