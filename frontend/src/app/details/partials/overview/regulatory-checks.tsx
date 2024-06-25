import React, {useEffect, useState} from "react";
import { Avatar, List } from 'antd';
import axios from "axios";

export const RegulatoryChecks = ({ theProduct, productId }) =>{
    const [records, setRecords] = useState([]);

    const queryRecord = async () =>{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${productId}`)
        const rec = response.data

        setRecords(rec.regulatoryChecks)
    }

    useEffect(() => {
        if (theProduct){
            setRecords(theProduct.regulatoryChecks || [])
        } else {
            queryRecord();
        }
    },[]);

    return (
        <List
            itemLayout="horizontal"
            dataSource={records}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        title={item?.notes}
                        description={
                            <div>Controlled by: {item?.signedBy?.stakeholder?.name}</div>
                        }
                    />
                </List.Item>
            )}
        />
    )
}