import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import { useData } from "../../hocs/dataProvider";
const { Dragger } = Upload;

const UploadFile = () => {
  const { dataDetails, setDataDetails } = useData();
  const [data, setData] = useState();

  useEffect(() => {
    console.log("Data");
    console.log(data);
    setDataDetails(data);
    console.log(dataDetails);
  });

  // const onClickButton = () => {
  //   console.log("Data");
  //   console.log(data);
  //   setDataDetails(data);
  //   console.log(dataDetails);
  // };

  return (
    <>
      <Dragger
        accept=".txt, .csv"
        showUploadList={true}
        multiple={false}
        beforeUpload={(file) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            console.log(e.target.result);
            setData(e.target.result);
          };
          reader.readAsText(file);

          // Prevent upload
          return false;
        }}
      >
        <p className="ant-upload-drag-icon"></p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
      {/* <Button onClick={onClickButton}></Button> */}
    </>
  );
};

export default UploadFile;
