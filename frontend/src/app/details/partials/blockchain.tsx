import {Button, Modal, Spin, Table, TableColumnsType} from "antd";
import React, {useEffect, useState} from "react";
import Overview from "@/app/details/partials/overview";
import axios from "axios";
import {compareRecords, SummaryRecord} from "@/app/lib/data-aggragation";

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
        //const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/blockchain/production/${productId}/history`)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/rec-compare`).catch(err => {
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
                    expandedRowRender: (record: SummaryRecord, index) => (
                        <div style={{ margin: 0 }}>
                            <>
                                {
                                    record?.Summaries.map(s => {
                                        return (
                                            <li><code>{JSON.stringify(s)}</code></li>
                                        )
                                    })
                                }
                            </>

                            <Button style={{ width: '100%', marginBottom: 10, marginTop: 10, backgroundColor: 'purple'}} type="primary" onClick={() =>showModal(record)}>
                                View Blockchain Record
                            </Button>
                        </div>)
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