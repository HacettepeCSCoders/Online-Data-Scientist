import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import { useData } from "../../hocs/dataProvider";
import { useFileName } from "../../hocs/fileNameProvider";
import * as XLSX from "xlsx";
import { useDataFiles } from "../../hocs/dataFileProvider";

const { Dragger } = Upload;

const UploadFile = () => {
  const { setDataDetails } = useData();
  const { setFileNameDetails } = useFileName();
  const [data, setData] = useState();
  const { storeFileData } = useDataFiles();

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      storeFileData(file);
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      console.log(d);
      setData(d);
    });
  };

  const readCSV = (file) => {
    const reader = new FileReader();
    storeFileData(file);
    reader.onload = (e) => {
      setData(e.target.result);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setDataDetails(data);
  });

  // hasHeader and csvDelimeter check buttons should be added ???????????????

  return (
    <>
      <div>
        <Dragger
          accept=".txt, .csv, .xlsx, .xls"
          showUploadList={true}
          multiple={false}
          beforeUpload={(file) => {
            const fileName = file.name;
            console.log(file);
            const fileNameArray = fileName.split(".");
            setFileNameDetails(fileNameArray[0]);
            const fileExtension = fileNameArray[1];
            if (fileExtension === "txt" || fileExtension === "csv") {
              readCSV(file);
            } else if (fileExtension === "xlsx" || fileExtension === "xls") {
              readExcel(file);
            }
            return false;
          }}
        >
          <p className="ant-upload-drag-icon"></p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Please upload Excel, CSV or TXT files.
            Uploading company data or other group files is a violation.
          </p>
        </Dragger>
      </div>
    </>
  );
};

export default UploadFile;
