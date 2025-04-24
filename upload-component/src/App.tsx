import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Upload, { UploadProps } from "./Upload";

const props: UploadProps = {
  name: "file",
  action: "http://localhost:3333/upload",
  beforeUpload(file) {
    if (file.name.includes("1.image")) {
      return false;
    }
    return true;
  },
  onSuccess(ret) {
    console.log("onSuccess", ret);
  },
  onError(err) {
    console.log("onError", err);
  },
  onProgress(percentage, file) {
    console.log("onProgress", percentage);
  },
  onChange(file) {
    console.log("onChange", file);
  },
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);

export default App;
