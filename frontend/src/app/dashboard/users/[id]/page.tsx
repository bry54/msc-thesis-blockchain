'use client';

import React, { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    Descriptions,
    DescriptionsProps,
    List,
    Modal,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
    Form, Input, Empty, Typography,
} from 'antd';
import { ArrowPathRoundedSquareIcon, UserIcon } from '@heroicons/react/20/solid';
import { HeaderButton, HeaderIconWithText } from '@/app/lib/components/header-items';
import { deleteUser, queryUser, queryUserHistory, updateUser } from '@/app/lib/actions/users';
import {EllipsisMiddle, RecordNotFound} from '@/app/lib/components/CommonItems';
import {
    AimOutlined,
    DownloadOutlined,
    HistoryOutlined,
    InfoOutlined,
    LeftOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addSummaries } from '@/app/lib/helpers';
import { addUserFields, editUserFields } from '@/app/dashboard/users/definitions';

const { Text } = Typography;


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
    const [items, setItems] = useState<DescriptionsProps['items']>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [allowUpdating, setAllowUpdating] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [recordHistory, setRecordHistory] = useState<RecordHistory[]>([])
    const router = useRouter()
    const [form] = Form.useForm();

    const closeForm = () => {
        setError(null);
        setAllowUpdating(false)
    }
    const fetchData = async () => {
        setLoading(true)
        try {
            const data: any = await queryUser(params.id);
            await fetchHistory()
            setData(data);
            setFormData(data)
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
            setRecordHistory(withKeys);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            await deleteUser(id);
            router.push('/dashboard/users')
        } catch (error){
            console.error('Error deleting user:', error);
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        try {
            setError(null)
            const {fullName, username } = formData
            const editableFields = {fullName, username}
            await updateUser(data.id, editableFields)
            await fetchData()
            closeForm()
        } catch (e: any){
            setError(e.message);
        }
    }

    useEffect(() => {
        fetchData()
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
        width: '70%',
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
        width: 100,
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
                                User History
                            </h2>
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                <HeaderIconWithText
                                    icon={<UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true"/>}
                                    label={data?.fullName || '--'}
                                />
                                <HeaderIconWithText
                                    icon={<InfoOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                        aria-hidden="true"/>}
                                    label={data?.id ? 'View the current world state and record history as it is on the blockchain' : 'Not found'}
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
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {!data && !loading ? (
                    <RecordNotFound redirectPath={"/dashboard/users"}/>
                ) : (
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
                        {allowUpdating ? (
                            <div className={'mb-5'}>
                                <div>
                                    <div className="space-y-12">
                                        <div className="pb-4">
                                            <div className="mt-0 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                {editUserFields.map(f => (
                                                        <div className="sm:col-span-2" key={f.id}>
                                                            <label htmlFor={f.id}
                                                                   className="block text-sm font-medium leading-6 text-gray-900">
                                                                {f.label}
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    value={formData[f.id] as any}
                                                                    type={f.type}
                                                                    name={f.id}
                                                                    id={f.id}
                                                                    autoComplete={f.autoComplete}
                                                                    onChange={(e) => setFormData({
                                                                        ...formData,
                                                                        [f.id]: e.target.value
                                                                    })}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Text type="danger">{error}</Text>

                                    <div className="mt-6 mb-6 flex items-center justify-center gap-x-6">
                                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
                                                onClick={() => closeForm()}>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 mb-5 ">
                                <Descriptions
                                    extra={
                                        <div>
                                            <Button type="primary" onClick={() => setAllowUpdating(true)}>
                                                Modify Record</Button>
                                            <Button className={'ml-3'} danger type="primary"
                                                    onClick={() => handleDelete(data.id)}>Delete Record</Button>
                                        </div>
                                    }
                                    title={(<p className="text-2xl"> Current State </p>)}
                                    className={'text-2xl'}

                                    items={items}/>
                            </div>
                        )}
                        <div className={'mt-6 border-t border-gray-900/10 pb-12'}>
                            <Table
                                title={() => (
                                    <div className={'mt-3 mb-3 flex justify-between'}>
                                        <div>
                                            <h1 className="text-2xl">Record History on blockchain</h1>
                                            <span className={'text-sm'}>This is a read only table, with a history of all changes made to this entry</span>
                                        </div>
                                        <HeaderButton
                                            btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                            icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5"
                                                                              aria-hidden="true"/>}
                                            label="Refresh"
                                            clickHandler={fetchData}
                                        />
                                    </div>
                                )}
                                scroll={{x: 1000}}
                                loading={loading}
                                columns={columns}
                                dataSource={recordHistory}
                                onChange={onChange}
                                showSorterTooltip={{target: 'sorter-icon'}}
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
                                        return (
                                            <div>
                                                <List
                                                    header={<p
                                                        className={'text-sm font-medium font-mono'}>{JSON.stringify(summary)}</p>}
                                                    bordered
                                                    dataSource={data}
                                                    renderItem={(item) => (
                                                        <Badge.Ribbon className='text-sm font-medium font-mono'
                                                                      text={record.summary.localTimestamp}>
                                                            <List.Item className='text-sm font-medium font-mono'>
                                                                <Tag color="geekblue"
                                                                     icon={
                                                                         <AimOutlined/>}>{item.key}</Tag>{JSON.stringify(item.data)}
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
                    </div>
                )}
            </main>
        </div>
    );
}

