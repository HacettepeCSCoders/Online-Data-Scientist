import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Descriptions, Tag } from "antd";

const ResultTab = ({ result, workspaceTypeDetails }) => {
  const printRef = React.useRef();
  const [testArray, setTestArray] = useState();
  const [mlArray, setMlarray] = useState();

  const generatePDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("report.pdf");
  };

  useEffect(() => {
    let arr = [];
    if (workspaceTypeDetails === "statistical") {
      for (const [key, value] of Object.entries(result)) {
        let obj = {};
        obj.name = key;
        obj.res = value;
        arr.push(obj);
      }
      setTestArray(arr);
    } else if (workspaceTypeDetails === "dataManipulation") {
      console.log();
    } else {
      setMlarray(result);
    }
  }, []);

  return (
    <>
      <div ref={printRef}>
        <Descriptions
          title={
            workspaceTypeDetails === "statistical"
              ? "Statistical Test"
              : workspaceTypeDetails === "dataManipulation"
              ? "Data Manipulation"
              : workspaceTypeDetails === "knn"
              ? "K-Nearest Neighbor"
              : workspaceTypeDetails === "svm"
              ? "Support Vector Machine"
              : workspaceTypeDetails === "kmean"
              ? "K Mean"
              : "DBScan"
          }
          size="middle"
          layout="vertical"
          bordered
          column={1}
        >
          {workspaceTypeDetails === "statistical" &&
            testArray &&
            testArray.map((item) => {
              return (
                <Descriptions.Item
                  label={<Tag className="nav-background">{item.name}</Tag>}
                >
                  {item.res}
                </Descriptions.Item>
              );
            })}
          {mlArray &&
            Object.keys(mlArray).map((item, i) => {
              return (
                <>
                  <Descriptions.Item
                    label={<Tag className="nav-background">{item} </Tag>}
                  >
                    {mlArray[item]}
                  </Descriptions.Item>
                </>
              );
            })}
        </Descriptions>
      </div>
      <br />
      <Button className="dark-background" onClick={generatePDF}>
        Export PDF
      </Button>
    </>
  );
};

export default ResultTab;
