import {Modal, Typography} from 'antd';
import {ExclamationCircleFilled} from '@ant-design/icons';
import Link from "next/link";
import React from "react";

const { confirm } = Modal;
const { Paragraph, Text } = Typography;


interface EllipseInterface{
  suffixCount: number;
  textClasses: string;
  children: string;
}

export const EllipsisMiddle: React.FC<EllipseInterface> = ({ suffixCount, textClasses,children}) => {
  const start = children.slice(0, children.length - suffixCount);
  const suffix = children.slice(-suffixCount).trim();

  return (
    <Paragraph copyable={{ text: children }}
      className={textClasses}
      style={{ maxWidth: '100%' }}
      ellipsis={{ suffix }}>
      {start}
    </Paragraph>
  );
};

export const showDeleteConfirm = (handleDelete: Function, title: string, description: string) => {
  confirm({
    title: title,
    icon: <ExclamationCircleFilled />,
    content: description,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      handleDelete()
    },
    onCancel() {

    },
  });
};

export const RecordNotFound: React.FC<{ redirectPath: string }> = ({redirectPath} ) =>{
  return (
      <div className="text-center mt-20 flex flex-col justify-center">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900 sm:text-2xl">
          Record Not Found
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          No record fround with the specified ID
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
              href={redirectPath}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Go Back
          </Link>
        </div>
      </div>
  )
}
