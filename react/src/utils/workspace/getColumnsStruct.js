import { useData } from "../../hocs/dataProvider";

export default (dataDetails) => {
  const rows = dataDetails.split("\n");
  let cols = rows.splice(0, 1)[0];
  cols = cols.split(/,|;/);
  const colArr = cols.map((col, idx) => {
    const structCol = {
      id: idx,
      name: col,
    };
    return structCol;
  });
  return colArr;
};
