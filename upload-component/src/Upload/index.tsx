import { FC, useRef, ChangeEvent, PropsWithChildren, useState } from "react";
import axios from "axios";

import "./index.scss";
import UploadList, { UploadFile } from "./UploadList";
import Dragger from "./Dragger";

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
  onRemove?: (file: UploadFile) => void;
  drag: boolean
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
    onRemove,
    drag
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
  const [filelist, setFilelist] = useState<Array<UploadFile>>([])

  const updateFileList = (updateFile: UploadFile, updateobj: Partial<UploadFile>) => {
    setFilelist(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateobj }
        } else {
          return file
        }
      })
    })
  }
  const handleRemove = (file: UploadFile) => {
    setFilelist(prevList => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    if (onRemove) {
      onRemove(file)
    }
  }
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
    const uploadFile: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }
    setFilelist(prevList => {
      return [uploadFile, ...prevList]
    })
    const formData = new FormData();
    formData.append(name || "file", file);
    /**
     * 在 post 函数中，data 参数被用于将额外的数据附加到 FormData 对象中。
     * FormData 是一种用于构建键值对的对象，通常用于在 POST 请求中发送数据。
     */
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
            updateFileList(uploadFile, { percent: percentage, status: 'uploading' })
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then(resp => {
        updateFileList(uploadFile, { status: 'success', response: resp.data })
        onSuccess?.(resp.data, file);
        onChange?.(file);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      })
      .catch(error => {
        updateFileList(uploadFile, { status: 'error', error })
        onError?.(error, file);
        onChange?.(file);
        console.error("Upload failed:", error);
      });
  };

  return (
    <div className="upload-component">
      <div className="upload-input" onClick={handleClick}>
        {drag ? <Dragger onFile={(files) => { uploadFiles(files) }}>
          {children}
        </Dragger> : children
        }
        < input
          className="upload-file-input"
          type="file"
          ref={fileInput}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
      </div>
      <UploadList
        fileList={filelist}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default Upload;
