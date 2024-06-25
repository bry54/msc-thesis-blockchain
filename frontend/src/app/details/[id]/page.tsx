'use client';

import React from 'react';
import {Tabs, TabsProps,} from 'antd';
import {ProductOutlined, QrcodeOutlined, TagsOutlined} from '@ant-design/icons';
import Overview from "@/app/details/partials/overview";
import Blockchain from "@/app/details/partials/blockchain";

export default function OpenDetailsPage({ params }: { params: { id: string } }) {

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Current State',
      children: (<Overview productId={params.id} theProduct={null}/>),
      icon: (<TagsOutlined />)
    },
    {
      key: '2',
      label: 'Blockchain History',
      children: (<Blockchain productId={params.id} />),
      icon: (<QrcodeOutlined />)
    },
  ];

  return (
      <div className='text-neutral-950'>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="h-full">
              <Tabs centered defaultActiveKey="1" items={items} onChange={(key) => console.log(key)} />
            </div>
          </div>
        </main>
      </div>
  );
}
