import {Collapse, CollapseProps} from "antd";

export default function Overview ({ productId }: { productId: string }): JSX.Element {
    const text = (
        <p style={{ paddingLeft: 24 }}>
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
            as a welcome guest in many households across the world.
        </p>
    );

    const items: CollapseProps['items'] = [
        {
            key: '0',
            label: 'Product Information',
            children: text,
        },
        {
            key: '1',
            label: 'Regulatory Checks',
            children: text,
        },
        {
            key: '2',
            label: 'Transportation Information',
            children: text,
        },
        {
            key: '3',
            label: 'Pricing Information',
            children: text,
        },
    ];
    return (
        <div>
            <Collapse items={items} bordered={false} defaultActiveKey={['0']}>

            </Collapse>
        </div>
    )
}