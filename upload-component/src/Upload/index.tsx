import { FC, useRef, ChangeEvent, PropsWithChildren } from "react";
import axios from "axios";

import "./index.scss";

export interface UploadProps extends PropsWithChildren {
  action: string;
  headers?: Record<string, any>;
  name?: string;
  data?: Record<string, any>;
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (file: File) => void;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: Error, file: File) => void;
}

const Upload: FC<UploadProps> = props => {
  const {
    action,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
  } = props;

  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    uploadFiles(files);
  };

  const uploadFiles = (files: FileList) => {
    const postFiles = Array.from(files);
    postFiles.forEach(file => {
      if (!beforeUpload) {
        post(file);
      } else {
        const result = beforeUpload(file);
        if (result instanceof Promise) {
          result.then(shouldUpload => {
            if (shouldUpload) {
              post(file);
            }
          });
        } else if (result) {
          post(file);
        }
      }
    });
  };

  const post = (file: File) => {
    const formData = new FormData();
    formData.append(name || "file", file);
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }

    axios
      .post(action, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials,
        // onUploadProgress是axios的钩子，用于监听上传进度
        onUploadProgress: e => {
          const percentage = Math.round((e.loaded * 100) / e.total!) || 0;
          if (percentage < 100) {
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then(resp => {
        onSuccess?.(resp.data, file);
        onChange?.(file);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      })
      .catch(error => {
        onError?.(error, file);
        onChange?.(file);
        console.error("Upload failed:", error);
      });
  };

  return (
    <div className="upload-component">
      <div className="upload-input" onClick={handleClick}>
        {children}
        <input
          className="upload-file-input"
          type="file"
          ref={fileInput}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default Upload;
