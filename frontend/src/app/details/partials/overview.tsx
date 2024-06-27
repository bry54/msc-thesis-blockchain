import {Collapse, CollapseProps} from "antd";
import {PricingDetails} from "@/app/details/partials/overview/pricing-details";
import {ProductDetails} from "@/app/details/partials/overview/product-details";
import {RegulatoryChecks} from "@/app/details/partials/overview/regulatory-checks";
import {TransportationDetails} from "@/app/details/partials/overview/transportation-details";

export default function Overview ({ productId, theProduct }: { productId: string | null, theProduct: any }): JSX.Element {
    const items: CollapseProps['items'] = [
        {
            key: '0',
            label: 'Product Information',
            children: <ProductDetails
                productId={productId}
                theProduct={theProduct}
            />,
        },
        {
            key: '1',
            label: 'Regulatory Checks',
            children: <RegulatoryChecks
                productId={productId}
                theProduct={theProduct}
            />,
        },
        {
            key: '2',
            label: 'Transportation Information',
            children: <TransportationDetails
                productId={productId}
                theProduct={theProduct}
            />,
        },
        {
            key: '3',
            label: 'Pricing Information',
            children: <PricingDetails
                productId={productId}
                theProduct={theProduct}
            />,
        },
    ];
    return (
        <div>
            <Collapse
                items={items}
                bordered={false}
                defaultActiveKey={['0']}
            />
        </div>
    )
}