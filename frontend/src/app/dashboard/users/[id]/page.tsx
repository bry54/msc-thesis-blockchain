'use client';

import React, {useEffect, useState} from 'react';
import {Button, Descriptions, DescriptionsProps, Table, TableColumnsType, TableProps} from 'antd';
import {ArrowPathRoundedSquareIcon, PlusCircleIcon, UserIcon,} from '@heroicons/react/20/solid';
import {HeaderButton, HeaderIconWithText} from '@/app/lib/components/header-items';
import {deleteUser, queryUser} from '@/app/lib/actions/users';
import {EllipsisMiddle} from '@/app/lib/components/CommonItems';
import {DownloadOutlined, HistoryOutlined} from '@ant-design/icons';
import {useRouter} from "next/navigation";

const descriptionLabels = [
    {key: 'id', value: 'Local ID'},
    {key: 'fullName', value: 'Full Name'},
    {key: 'username', value: 'Username'},
    {key: 'organization', value: 'Organization'},
    {key: 'role', value: 'Role'},
    {key: 'updatedDate', value: 'Last Update'},
    {key: 'createdAt', value: 'Created At'},
    {key: 'deletedDate', value: 'Deleted At'},
]

interface DataType {
    id: string,
    fullName: string,
    username: string
}

interface Modals {
    addModal: boolean,
    deleteModal: boolean
}

export default function UserPage({ params }: { params: { id: string } }) {

    const [data, setData] = useState<DataType>(null);
    const [items, setItems] = useState<DescriptionsProps['items']>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<Modals>({ addModal: false, deleteModal: false });
    const [confirmLoading, setConfirmLoading] = useState<Modals>({ addModal: false, deleteModal: false });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const fetchData = async () => {
        setLoading(true)
        try {
            const data: any = await queryUser(params.id);
            setData(data);

            const items: DescriptionsProps['items'] = Object.keys(data).map((d: any) =>{
                return {
                    key: d,
                    label: descriptionLabels.find(label => label.key === d)?.value || 'Label',
                    children: data[d]

                }
            })

            setItems(items)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserDelete = async (id: string) => {
        setLoading(true)
        try {
            await deleteUser(id);
            // redirect back to users pages
        } catch (error){
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once after the initial render


    const columns: TableColumnsType<DataType> = [{
        title: 'Transaction Id',
        dataIndex: 'txid',
        key: 'txid',
        filters: [],
        width: '20%',
        render: (text) => (
            <EllipsisMiddle
                suffixCount={8}
                textClasses="text-sm font-bold">
                { text }
            </EllipsisMiddle>
        ),
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    }, {
        title: 'Summary',
        dataIndex: 'summary',
        key: 'summary',
        render: (text) => (<span className="text-sm font-medium">{ text } </span>),
        showSorterTooltip: { target: 'full-header' },
        filters: [], // specify the condition of filtering result
        onFilter: (value, record) => record.fullName.indexOf(value as string) === 0,
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    },{
        title: 'Actions',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (data) => (<span className='flex justify-between'>
            <Button type="primary" icon={<DownloadOutlined />} size={'small'} title='Download User History'/>
        </span>),
    },];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='text-neutral-950'>
            <header className="bg-white shadow pl-24 pr-20 pt-10 pb-10 ">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2
                            className="font-medium text-2xl leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Users History
                        </h2>
                        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                            <HeaderIconWithText
                                icon={<UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true" />}
                                label={'user-name'}
                            />
                            <HeaderIconWithText
                                icon={<HistoryOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true" />}
                                label={'history'}
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex lg:ml-4 lg:mt-0">
                        <HeaderButton
                            btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                            label="Refresh"
                            clickHandler={fetchData}
                        />

                        <HeaderButton
                            btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            icon={<PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                            label="Add User"
                            clickHandler={() => handleUserDelete('')}
                        />
                    </div>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className='mt-2 mb-5'>
                    <Descriptions
                        title={ (<h1 className='text-2xl'>Current State</h1>) }
                        className={'text-2xl'}
                        items={items} />
                    </div>
                    <Table
                        title={() =>(<h1 className="text-2xl">Record History on blockchain</h1>)}
                        scroll={{ x: 1500 }}
                        loading={loading}
                        columns={columns}
                        dataSource={[]}
                        onChange={onChange}
                        showSorterTooltip={{ target: 'sorter-icon' }}
                    />
                </div>
            </main>
        </div>
    );
}

