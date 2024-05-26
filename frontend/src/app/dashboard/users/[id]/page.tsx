'use client';

import React, {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Descriptions,
    DescriptionsProps,
    Form,
    List,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
    Typography,
    Modal,
    Input,
    Select
} from 'antd';
import {ArrowPathRoundedSquareIcon, UserIcon} from '@heroicons/react/20/solid';
import {HeaderButton, HeaderIconWithText} from '@/app/lib/components/header-items';
import {deleteUser, queryUser, queryUserHistory, updateUser} from '@/app/lib/actions/users';
import {EllipsisMiddle, RecordNotFound} from '@/app/lib/components/CommonItems';
import {AimOutlined, DownloadOutlined, InfoOutlined, LeftOutlined,} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {addSummaries} from '@/app/lib/helpers';
import {editUserFields, Roles} from '@/app/dashboard/users/definitions';
import { queryStakeholders } from '@/app/lib/actions/stakeholders';

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
    username: string,
    role: string,
    stakeholderId: string
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
    const [stakeholders, setStakeholders] = useState<any[]>([])
    const router = useRouter()
    const [form] = Form.useForm();

    const closeForm = () => {
        setError(null);
        setAllowUpdating(false)
    }

    const openForm = async() => {
        const data = await queryStakeholders();
        setStakeholders((prevState)=>{
            return data
        })
        setAllowUpdating(true)
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const data: any = await queryUser(params.id);
            await fetchHistory()
            setData(data);
            setFormData(data)
            const toShow = {...data}
            delete toShow.createAt;
            delete toShow.updatedDate;
            delete toShow.deletedDate;
            delete toShow.stakeholderId;
            delete toShow.updatedBy;

            const items: DescriptionsProps['items'] = Object.keys(toShow).map((d: any) =>{
                return {
                    key: d,
                    label: descriptionLabels.find(label => label.key === d)?.value || 'Label',
                    children: [].find(v => v ===d )
                        ?
                        data[d] : (<span> {d=='stakeholder' ? `${data[d]?.name}, ${data[d]?.location}` : data[d] } </span>)
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
        const values: any = form.getFieldsValue();
        try {
            setError(null)
            const {fullName, username } = formData
            const editableFields = {fullName, username}
            await updateUser(data.id, values)
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
    }];

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
                        
                            <div className="mt-2 mb-5 ">
                                <Descriptions
                                    extra={
                                        <div>
                                            <Button type="primary" onClick={openForm}>
                                                Modify Record</Button>
                                            <Button className={'ml-3'} danger type="primary"
                                                    onClick={() => handleDelete(data.id)}>Delete Record</Button>
                                        </div>
                                    }
                                    title={(<p className="text-2xl"> Current State </p>)}
                                    className={'text-2xl'}

                                    items={items}/>
                            </div>

                            {data && <Form form={form}
                  name="updateUser"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  initialValues={{ 
                    stakeholderId: data?.stakeholderId,
                    fullName: data?.fullName,
                    username: data?.username,
                    role: data?.role,

                }}
                  onFinish={() => alert('onFinish invoked')}
                  onFinishFailed={() => alert('onFinishFailed invoked')}
                  autoComplete="off">

              <Modal
                title="Update User"
                open={allowUpdating}
                onOk={handleUpdate}
                confirmLoading={false}
                onCancel={closeForm}>
                <Form.Item
                  label="Fullname"
                  name="fullName"
                  rules={[{ required: true, message: 'Fullname can not be empty' }]}>
                  <Input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Username can not be empty' }]}>
                  <Input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: 'Role can not be empty' }]}>
                  <Select placeholder="select product origin">
                    {[Roles.ADMINISTRATOR, Roles.FARMER, Roles.MANAGER, Roles.REGULATION_CHECHER].map(s =>{
                      return (<Select.Option key={s} value={s}> {s} </Select.Option>)
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="stakeholderId"
                  label="Organization"
                  rules={[{ required: false, message: 'Select organization for the user' }]}>
                  <Select placeholder="Select organization for the user">
                    {stakeholders.map(s =>{
                      return (<Select.Option key={s.id} value={s.id}> {s.name} </Select.Option>)
                    })}
                  </Select>
                </Form.Item>
              </Modal>
            </Form>}

                        
                        <div className={'mt-6 border-t border-gray-900/10 pb-12'}>
                            <Table
                                title={() => (
                                    <div className={'mt-3 mb-3 flex justify-between'}>
                                        <div>
                                            <h1 className="text-2xl">Record History on blockchain</h1>
                                            <span className={'text-sm'}>This is a read only table, with a history of all changes made to this entry</span>
                                        </div>

                                        <div className='flex flex-end'>
                                        <HeaderButton
                                            btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                            icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5"
                                                                              aria-hidden="true"/>}
                                            label="Refresh"
                                            clickHandler={fetchData}
                                        />
                                        
                                        <HeaderButton
                                            btnClasses="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                            icon={<DownloadOutlined className="-ml-0.5 mr-1.5 h-5 w-5"
                                                                              aria-hidden="true"/>}
                                            label="Download"
                                            clickHandler={() => alert('exports full log of record history')}
                                        />
                                        </div>
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

