import {Button, Modal, Table, TableColumnsType} from "antd";
import React, {useState} from "react";
import Overview from "@/app/details/partials/overview";
import axios from "axios";

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Transaction ID',
        dataIndex: 'name',
        key: 'name',
        width: '100%',
    },
    Table.EXPAND_COLUMN,

];

const data: DataType[] = [
    {
        key: 1,
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
        key: 2,
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
        key: 3,
        name: 'Not Expandable',
        age: 29,
        address: 'Jiangsu No. 1 Lake Park',
        description: 'This not expandable',
    },
    {
        key: 4,
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
    },
];

export default function Blockchain ({ productId }: { productId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({});

    const showModal = async (transactionId: string) => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/blockchain/production/${productId}`)
        const rec = response.data

        setData(rec)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Table
                columns={columns}
                rowSelection={{}}
                expandable={{
                    expandedRowRender: (record: DataType, index) => (
                        <div style={{ margin: 0 }}>
                            <Button style={{ width: '100%', marginBottom: 10}} type="primary" onClick={() =>showModal(record.name)}>
                                View Blockchain Record
                            </Button>

                            {record.description}
                        </div>)
                }}
                dataSource={data}
            />
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Overview
                    productId={null}
                    theProduct={{}}
                />
            </Modal>
        </>
    );
}