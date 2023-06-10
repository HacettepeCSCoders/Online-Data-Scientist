import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Descriptions, Tag } from "antd";

const ResultTab = ({ result, workspaceTypeDetails }) => {
  const printRef = React.useRef();
  const [testArray, setTestArray] = useState();

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
    if (workspaceTypeDetails == "statistical") {
      for (const [key, value] of Object.entries(result)) {
        let obj = {};
        obj.name = key;
        obj.res = value;
        arr.push(obj);
      }
    } else if (workspaceTypeDetails == "dataManipulation") {
      console.log();
    }
    setTestArray(arr);
  }, []);

  return (
    <>
      <div ref={printRef}>
        {workspaceTypeDetails == "statistical" && (
          <Descriptions
            title="Statistical Test"
            size="middle"
            layout="vertical"
            bordered
            column={1}
          >
            {testArray &&
              testArray.map((item) => {
                return (
                  <Descriptions.Item
                    label={<Tag className="nav-background">{item.name}</Tag>}
                  >
                    {item.res}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>
        )}
      </div>
      <br />
      <Button className="dark-background" onClick={generatePDF}>
        Export PDF
      </Button>
    </>
  );
};

export default ResultTab;
