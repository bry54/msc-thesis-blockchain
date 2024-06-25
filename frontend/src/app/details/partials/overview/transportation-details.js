import React, {useEffect, useState} from "react";
import { Typography, List } from 'antd';
import axios from "axios";

export const TransportationDetails = ({ productId }) =>{
    const [records, setRecords] = useState([]);

    const queryRecord = async () =>{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${productId}`)
        const rec = response.data

        setRecords(rec?.transportationDetail)
    }

    useEffect(() => {
        queryRecord();
    },[]);

    return (
        <List
            itemLayout="horizontal"
            dataSource={records}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        title={
                            <div>
                                <Typography.Text level={3}>FROM:</Typography.Text> {item.departure.stakeholder.name}
                                <br/>{item.departure.stakeholder.location}
                                <br/>{item.departure.date}
                            </div>
                        }
                        description={`${item?.departure.notes}`}
                    />
                    {item.content}

                    <List.Item.Meta
                        title={<div>TO: {item.destination.stakeholder.name} <br/>{item.destination.stakeholder.location}<br/>{item.destination.date}</div>}
                        description={`${item?.destination.notes}`}
                    />
                </List.Item>
            )}
        />
    )
}