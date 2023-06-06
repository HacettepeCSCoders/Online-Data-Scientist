import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Descriptions } from "antd";

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
    for (const [key, value] of Object.entries(result)) {
      let obj = {};
      obj.name = key;
      obj.res = value;
      arr.push(obj);
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
          >
            {testArray &&
              testArray.map((item) => (
                <Descriptions.Item label={item.name}>
                  {item.res}
                </Descriptions.Item>
              ))}
          </Descriptions>
        )}
      </div>
      <Button className="dark-background" onClick={generatePDF}>
        Export PDF
      </Button>
    </>
  );
};

export default ResultTab;
