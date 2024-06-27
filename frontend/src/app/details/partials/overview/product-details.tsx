import React, {useEffect, useState} from "react";
import { Avatar, List } from 'antd';
import axios from "axios";
import moment from "moment";

export const ProductDetails = ({ theProduct, productId }) =>{
    const [record, setRecord] = useState<any>({});

    const queryRecord = async () =>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${productId}`, {})
            const rec = response.data

            setRecord(rec)
        } catch(error){
            console.log(error, 'ERROR FETCHING PRODUCT DETAILS')
        }
    }

    useEffect(() => {
        if (theProduct){
            setRecord(theProduct)
        } else {
            queryRecord();
        }
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
                            title={
                                <div>
                                    <span style={{ textTransform: 'capitalize'}}>{record?.origin?.name.toLocaleLowerCase()}</span>
                                    <br/> <span style={{ textTransform: 'capitalize'}}>{record?.origin?.type.toLocaleLowerCase()}</span>
                                </div>
                            }
                            description={`${record?.origin?.location}, ${record?.origin?.contactNumber}` }
                        />
                    }

                    {
                        item === 'planting' && <List.Item.Meta
                            title={
                                <span>
                                    {
                                        record?.planting?.date ? `Planted On: ${moment(record?.planting?.date).format('LLL')}` : 'Planted On:--'
                                    }
                                </span>
                            }
                            description={`Quantity Planted: ${record?.planting?.quantity  || '--'} `}
                        />
                    }

                    {
                        item === 'harvesting' && <List.Item.Meta
                            title={
                                <span>
                                    {
                                        record?.harvesting?.date ? `Harvested On: ${moment(record?.harvesting?.date).format('LLL')}` : 'Harvested On: --'
                                    }
                                </span>
                            }
                            description={`Quantity Harvested: ${record?.harvesting?.quantity  || '--'} `}
                        />
                    }
                </List.Item>
            )}
        />
    )
}