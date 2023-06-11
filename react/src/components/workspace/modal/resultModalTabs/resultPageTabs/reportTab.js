import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Descriptions, Tag } from "antd";
import { act } from "react-dom/test-utils";

const ReportTab = ({ result, workspaceTypeDetails }) => {
  const printRef = React.useRef();
  const [testArray, setTestArray] = useState();
  const [mlArray, setMlarray] = useState();
  const [manipText, setManipText] = useState();

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
      setManipText(
        " All selected processes have been successfully executed. If you want to continue the ML and Statistic tests. You can continue from the Workspace page."
      );
    } else if (workspaceTypeDetails === "knn") {
      setMlarray(result);
    } else {
      setMlarray(result);
    }
  }, []);

  return (
    <>
      <div ref={printRef}>
        <div>
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
            layout={mlArray ? "horizontal" : "vertical"}
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
                    {item !== "plot" && item !== "data" && (
                      <Descriptions.Item
                        label={<Tag className="nav-background">{item} </Tag>}
                      >
                        {item === "Confusion Matrix" &&
                        typeof mlArray[item] === "object"
                          ? mlArray[item].map((a, i) => {
                              return (
                                <>
                                  {a.join(", ")}

                                  <br />
                                </>
                              );
                            })
                          : mlArray[item]}
                      </Descriptions.Item>
                    )}
                  </>
                );
              })}
            {manipText && (
              <Descriptions.Item
                label={<Tag className="nav-background">Success</Tag>}
              >
                {manipText}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
      <br />
      <Button className="dark-background" onClick={generatePDF}>
        Export PDF
      </Button>
    </>
  );
};

export default ReportTab;
