'use client';

import React, { useEffect, useState } from 'react';
import { Badge, Button, Descriptions, DescriptionsProps, List, Table, TableColumnsType, TableProps, Tag, Typography } from 'antd';
import { ArrowPathRoundedSquareIcon, UserIcon } from '@heroicons/react/20/solid';
import { HeaderButton, HeaderIconWithText } from '@/app/lib/components/header-items';
import { deleteUser, queryUser, queryUserHistory } from '@/app/lib/actions/users';
import { EllipsisMiddle } from '@/app/lib/components/CommonItems';
import { AimOutlined, DownloadOutlined, HistoryOutlined, LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addSummaries } from '@/app/lib/helpers';


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

interface UserModel {
    id: string,
    fullName: string,
    username: string
}

interface RecordHistory {
    "TxId": string,
    "Timestamp": {
        "seconds": number,
        "nanos": number
    },
    "Record": {
        "ID": string,
        "fullName": string,
        "username": string,
        "password": string,
        "createdAt": string,
        "updatedDate": string,
        "deletedDate": string
    }
    summary: any
}

interface Modals {
    addModal: boolean,
    deleteModal: boolean
}

export default function UserPage({ params }: { params: { id: string } }) {

    const [data, setData] = useState<UserModel>(null);
    const [items, setItems] = useState<DescriptionsProps['items']>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<Modals>({ addModal: false, deleteModal: false });
    const [confirmLoading, setConfirmLoading] = useState<Modals>({ addModal: false, deleteModal: false });
    const [error, setError] = useState<string | null>(null);
    const [userHistory, setUserHistory] = useState<RecordHistory[]>([])
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
                    children: [].find(v => v ===d )
                        ?
                        data[d] : (<span> {data[d]}</span>)
                }
            })
            setItems(items)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const data: RecordHistory[] = await queryUserHistory(params.id);
            const withSummary = addSummaries(data)
            const withKeys = withSummary.map(d => ({ key: d.TxId, ...d}))
            setUserHistory(withKeys);
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
            router.push('/dashboard/users')
        } catch (error){
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateUser = (data: any) => {
        //console.log(data)
    }

    useEffect(() => {
        fetchData().then(res => {
            fetchHistory()
        });
    }, []); // Empty dependency array means this effect runs once after the initial render

    const columns: TableColumnsType<RecordHistory> = [{
        title: 'Transaction Id',
        dataIndex: 'TxId',
        key: 'TxId',
        filters: [],
        width: '20%',
        render: (text) => (
            <EllipsisMiddle
                suffixCount={8}
                textClasses="text-sm font-bold font-mono">
                { text }
            </EllipsisMiddle>
        ),
    }, {
        title: 'Summary',
        dataIndex: 'summary',
        key: 'summary',
        render: (summary) => {
            if(summary.changes)
                return (<span className="text-sm font-medium font-mono">Record Updated: Changes on {JSON.stringify(Object.keys(summary.changes))} </span>)
            else
                return (<span className="text-sm font-medium font-mono">{JSON.stringify(summary.summary)} </span>)
        },
        showSorterTooltip: { target: 'full-header' },
        filters: [], // specify the condition of filtering result
    },{
        title: 'Actions',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (data) => (<span className='flex justify-between'>
            <Button type="primary" icon={<DownloadOutlined />} size={'small'} title='Download User History'/>
        </span>),
    },];

    const onChange: TableProps<RecordHistory>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='text-neutral-950'>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2
                                className="font-medium text-2xl leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Users History
                            </h2>
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                <HeaderIconWithText
                                    icon={<UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true"/>}
                                    label={data?.fullName}
                                />
                                <HeaderIconWithText
                                    icon={<HistoryOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                           aria-hidden="true"/>}
                                    label={'history'}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex lg:ml-4 lg:mt-0">
                            <Link href='/dashboard/users'>
                                <HeaderButton
                                    btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    icon={<LeftOutlined className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>}
                                    label="Back"
                                />
                            </Link>

                            <HeaderButton
                                btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5"
                                                                  aria-hidden="true"/>}
                                label="Refresh"
                                clickHandler={fetchData}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className='mt-2 mb-5'>
                        <Descriptions
                            extra={<Button danger type="primary" onClick={() => handleUserDelete(data.id)}>Delete User</Button>}
                            title={ (<h1 className='text-2xl'>Current State</h1>) }
                            className={'text-2xl'}
                            items={items} />
                    </div>
                    <Table
                        title={() =>(<h1 className="text-2xl">Record History on blockchain</h1>)}
                        scroll={{ x: 1500 }}
                        loading={loading}
                        columns={columns}
                        dataSource={userHistory}
                        onChange={onChange}
                        showSorterTooltip={{ target: 'sorter-icon' }}
                        expandable={{
                            expandedRowRender: (record) => {
                                const changes = record.summary.changes
                                const summary = record.summary.summary
                                const data = Object.keys(changes).map(k => {
                                    return {
                                        key: k,
                                        data: record.summary.changes[k]
                                    }
                                })
                                return(
                                  <div>
                                      <List
                                        header={<p className={'text-sm font-medium font-mono'}>{JSON.stringify(summary)}</p>}
                                        bordered
                                        dataSource={data}
                                        renderItem={(item) => (
                                          <Badge.Ribbon text={JSON.stringify(record.summary.localTimestamp)}>
                                              <List.Item className='text-sm font-medium font-mono'>
                                                  <Tag color="geekblue" icon={<AimOutlined />}>{item.key}</Tag>{JSON.stringify(item.data)}
                                              </List.Item>
                                          </Badge.Ribbon>

                                        )}
                                      />
                                  </div>
                                )
                            },
                            rowExpandable: (record) => record.summary.summary !== 'Initial record',
                        }}
                    />
                </div>
            </main>
        </div>
    );
}

