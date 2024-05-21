import { Typography } from 'antd';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

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

