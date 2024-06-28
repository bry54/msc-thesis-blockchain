import {Badge, Button, List, Modal, Spin, Table, TableColumnsType, Tag} from "antd";
import React, {useEffect, useState} from "react";
import Overview from "@/app/details/partials/overview";
import axios from "axios";
import {compareRecords, Summary, SummaryRecord} from "@/app/lib/data-aggragation";
import {AimOutlined, CheckCircleOutlined, VerifiedOutlined} from "@ant-design/icons";

const columns: TableColumnsType<SummaryRecord> = [
    {
        title: 'Transaction ID',
        dataIndex: 'TxId',
        key: 'TxId',
        width: '100%',
        render: (value, record) => (<code>{record.TxId}</code>)
    },
    Table.EXPAND_COLUMN,

];

export default function Blockchain ({ productId }: { productId: string }) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [theProduct, setTheProduct] = useState<SummaryRecord|null >(null);
    const [data, setData] = useState<SummaryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadHistory = async () =>{
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/blockchain/production/${productId}/history`)
            .catch(err => {
            setIsLoading(false)
            return
        })
        const data = response?.data || []

        let withSummary = compareRecords(data);
        withSummary = withSummary.map(item => ({key: item.TxId, ...item}));

        setData(withSummary);
        setIsLoading(false)
    }

    const showModal = async (selectedItem: SummaryRecord) => {
        setTheProduct((prevState) => selectedItem);

        setIsModalOpen((prevState) => true);
    };

    const handleOk = () => {
        setIsModalOpen((prevState) => false);
    };

    const handleCancel = () => {
        setTheProduct((prevState) => null)
        setIsModalOpen((prevState) => false);
    };

    useEffect(() => {
        loadHistory()
    },[]);

    return (
        <>
            <Spin
                fullscreen={true}
                spinning={isLoading}
                size="large" />
            <Table
                columns={columns}
                //rowSelection={{}}
                expandable={{
                    expandedRowRender: (record: SummaryRecord) => {
                        const summaries = record.Summaries

                        const data = Object.keys(summaries).map(k => {
                            return {
                                key: k,
                                data: summaries[k]
                            }
                        })
                        return (
                            <div>
                                <List
                                    header={
                                        <ol className={'text-sm font-medium font-mono'} style={{lineHeight: 1.75}}>
                                            {
                                                summaries.map((s: Summary, index) => {
                                                    const keys = Object.keys(s)
                                                    const data = keys.map((k) => (s[k]))

                                                    if (Array.isArray(data)) {
                                                        return data.map((inner, iIndex) => {
                                                            if (Array.isArray(inner)) {
                                                                return inner.map((s, sIndex) => (
                                                                    <li key={sIndex}>
                                                                        &bull; <code>{JSON.stringify(s)}</code>
                                                                    </li>
                                                                ))
                                                            }
                                                            return (
                                                                <li key={iIndex}>
                                                                    &bull; <code>{JSON.stringify(inner)}</code>
                                                                </li>
                                                            )
                                                        })
                                                    } else {
                                                        return (
                                                            <li key={index}> &bull;
                                                                <code>{JSON.stringify(data)}</code>
                                                            </li>
                                                        )
                                                    }
                                                })
                                            }
                                        </ol>
                                    }
                                    bordered
                                    dataSource={data}
                                    renderItem={(item) => (
                                        <Badge.Ribbon className='text-sm font-medium font-mono' text={record?.Timestamp}>
                                            <List.Item className='text-sm font-medium font-mono'>
                                                <Tag color="geekblue"
                                                     icon={
                                                         <VerifiedOutlined size={2}/>}
                                                ></Tag>
                                            </List.Item>
                                        </Badge.Ribbon>

                                    )}
                                />
                            </div>
                        )
                    },
                    rowExpandable: (record: SummaryRecord) => record.Summaries.length != 0 ,
                }}
                dataSource={data}
            />
            {theProduct && <Modal
                title={<code>{`ID: ${theProduct?.TxId}`}</code>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Overview
                    productId={null}
                    theProduct={theProduct.Record}
                />
            </Modal>}
        </>
    );
}