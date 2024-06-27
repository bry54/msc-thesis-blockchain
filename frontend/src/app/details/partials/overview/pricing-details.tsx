import React, {useEffect, useState} from "react";
import {List} from 'antd';
import axios from "axios";

export const PricingDetails = ({ theProduct, productId }) =>{
    const [records, setRecords] = useState([]);

    const queryRecord = async () =>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${productId}`)
            const rec = response.data

            setRecords(rec.pricingDetail)
        } catch (e) {
            console.log(e, 'ERROR FETCHING PRICING DETAILS')
        }
    }

    useEffect(() => {
        if (theProduct){
            setRecords(theProduct.pricingDetail || [])
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
                        title={item?.pricePerUnit}
                        description={`${item?.stakeHolder?.name}, ${item?.date}` }
                    />
                </List.Item>
            )}
        />
    )
}