import React, {useEffect, useState} from "react";
import { Avatar, List } from 'antd';
import axios from "axios";

export const ProductDetails = ({ productId }) =>{
    const [record, setRecord] = useState({});

    const queryRecord = async () =>{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${productId}`)
        const rec = response.data

        setRecord(rec)
    }

    useEffect(() => {
        queryRecord();
    },[]);

    return (
        <List
            itemLayout="horizontal"
            dataSource={['product', 'origin', 'planting', 'harvesting']}
            renderItem={(item, index) => (
                <List.Item>
                    {
                        item === 'product' && <List.Item.Meta
                            title={record?.product?.name}
                            description={record?.product?.category}
                        />
                    }

                    {
                        item === 'origin' && <List.Item.Meta
                            title={`${record?.origin?.name} | ${record?.origin?.type}`}
                            description={`${record?.origin?.location}, ${record?.origin?.contactNumber}` }
                        />
                    }

                    {
                        item === 'planting' && <List.Item.Meta
                            title={<a>Planted On: {record?.planting?.date || '--'}</a>}
                            description={`Quantity Planted: ${record?.planting?.quantity  || '--'} `}
                        />
                    }

                    {
                        item === 'harvesting' && <List.Item.Meta
                            title={<a>Harvested On: {record?.harvesting?.date  || '--'}</a>}
                            description={`Quantity Harvested: ${record?.harvesting?.quantity  || '--'} `}
                        />
                    }
                </List.Item>
            )}
        />
    )
}