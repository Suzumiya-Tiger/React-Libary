import { FC } from 'react'
import { Progress } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, FileOutlined, LoadingOutlined } from '@ant-design/icons';

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: 'ready' | 'uploading' | 'success' | 'error';
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (file: UploadFile) => void;
}

const Uploadlist: FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props
  return (
    <ul className='upload-list'>
      {
        fileList.map(item => {
          return (
            <li className={`upload-list-item upload-list-item-${item.status}`} key={item.uid}>
              <span className='file-name'>
                {
                  (item.status === 'uploading' || item.status === 'ready') && <LoadingOutlined></LoadingOutlined>
                }
                {
                  item.status === 'success' && <CheckOutlined></CheckOutlined>
                }
                {
                  item.status === 'error' && <CloseOutlined></CloseOutlined>
                }
                <span className='file-name-title'>{item.name}</span>
              </span>
              <span className='file-actions'>
                <DeleteOutlined onClick={() => onRemove(item)}></DeleteOutlined>
              </span>
              {
                item.status === 'uploading' && <Progress percent={item.percent}></Progress>
              }
            </li>
          )
        })
      }
    </ul>
  )
}

export default Uploadlist