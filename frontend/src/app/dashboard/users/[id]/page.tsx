'use client';

import React, {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Descriptions,
    DescriptionsProps,
    Form,
    Input,
    List,
    Modal,
    Select,
    Table,
    TableColumnsType,
    Tag
} from 'antd';
import {ArrowPathRoundedSquareIcon, UserIcon} from '@heroicons/react/20/solid';
import {HeaderButton, HeaderIconWithText} from '@/app/lib/components/header-items';
import {deleteUser, queryUser, queryUserHistory, updateUser} from '@/app/lib/actions/users';
import {EllipsisMiddle, RecordNotFound, showDeleteConfirm} from '@/app/lib/components/CommonItems';
import {AimOutlined, DownloadOutlined, InfoOutlined, LeftOutlined,} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {addSummaries} from '@/app/lib/helpers';
import {queryStakeholders} from '@/app/lib/actions/stakeholders';
import {DataSetProps, ErrorProps, ModalVisibilityProps, ProcessingProps} from "@/app/lib/interfaces";
import {dataSetInitialState, errorsInitialState, modalsInitialState, processingInitialState} from "@/app/lib/constants";
import {DataSetName, ModalName, ProcessName, Roles} from "@/app/lib/enums";
import {BlockchainUserModel, userDescriptionLabels, UserModel} from "@/app/dashboard/users/definitions";

enum Extras {
    STAKEHOLDERS = 'stakeholders',
    DESCRIPTION_ITEMS = 'descriptionItems'
}

export default function UserPage({ params }: { params: { id: string } }) {
    const [modalVisibilityState, setModalVisibilityState] = useState<ModalVisibilityProps>(modalsInitialState);
    const [processingState, setProcessingState] = useState<ProcessingProps>(processingInitialState);
    const [dataSetState, setDataSetState] = useState<DataSetProps>(dataSetInitialState);
    const [errorState, setError] = useState<ErrorProps>(errorsInitialState);
    const [extras, setExtras] = useState<{ [k: string]: any }>(errorsInitialState);

    const router = useRouter()
    const [form] = Form.useForm();

    const updateDatasetState = (datasetName: DataSetName, data: any) => {
        setDataSetState((prevState: DataSetProps) =>{
            return {
                ...prevState,
                [datasetName] : data
            }
        })
    }

    const updateProcessingState = (processName: ProcessName, state: boolean) => {
        setProcessingState((prevState: ProcessingProps) => {
            return {
                ...prevState,
                [processName]: state
            }
        })
    }

    const updateModalVisibilityState = (modalName: ModalName, state: boolean) =>{
        setModalVisibilityState((prevState: ModalVisibilityProps) =>{
            return {
                ...prevState,
                [modalName]: state
            }
        })
    }

    const updateErrorState = (processName: ProcessName, error: any) =>{
        setError((prevState: ErrorProps) => {
            return {
                ...prevState,
                [processName]: error
            }
        })
    }

    const updateExtrasState = (extraName: string, data: any) => {
        setExtras((prevState) => {
            return {
                ...prevState,
                [extraName] : data
            }
        })
    }

    const fetchData = async () => {
        updateProcessingState(ProcessName.LOADING_ONE, true)
        try {
            const data: any = await queryUser(params.id);
            updateDatasetState(DataSetName.ONE_RESOURCE, data);

            await fetchHistory()

            const descriptionItems: DescriptionsProps['items'] = userDescriptionLabels.map((d: any) => {
                let val = data[d.key]

                if (d.key == 'stakeholder')
                    val = <span> { `${val?.name}, ${val?.location}`} </span>

                return {
                    key: d.key,
                    label: d.value,
                    children: val
                }
            });

            updateExtrasState(Extras.DESCRIPTION_ITEMS, descriptionItems)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            updateProcessingState(ProcessName.LOADING_ONE, false);
        }
    };

    const fetchHistory = async () => {
        updateProcessingState(ProcessName.LOADING_HISTORY, true)
        try {
            const data: UserModel[] = await queryUserHistory(params.id);
            const withSummary = addSummaries(data)
            const withKeys: BlockchainUserModel[] = withSummary.map(d => ({ key: d.TxId, ...d}));

            updateDatasetState(DataSetName.RESOURCE_HISTORY, withKeys);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            updateProcessingState(ProcessName.LOADING_HISTORY, false);
        }
    };

    const handleDelete = async () => {
        const id = params.id
        updateProcessingState(ProcessName.DELETING_ONE, true)
        updateErrorState(ProcessName.DELETING_ONE, null)
        try {
            await deleteUser(id);
            router.push('/dashboard/users')
        } catch (error: any){
            console.error('Error deleting user:', error);
            updateErrorState(ProcessName.DELETING_ONE, error.message)
        } finally {
            updateProcessingState(ProcessName.DELETING_ONE, false)
        }
    }

    const handleUpdate = async () => {
        const values: any = form.getFieldsValue();
        try {
            updateErrorState(ProcessName.DELETING_ONE, null)
            await updateUser(params.id, values)
            await fetchData()
            updateModalVisibilityState(ModalName.UPDATE_MODAL, false)
        } catch (e: any){
            setError(e.message);
        }
    }

    useEffect(() => {
        fetchData()
    }, []); // Empty dependency array means this effect runs once after the initial render

    const columns: TableColumnsType<BlockchainUserModel> = [{
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
                                    label={dataSetState[DataSetName.ONE_RESOURCE]?.fullName || '--'}
                                />
                                <HeaderIconWithText
                                    icon={<InfoOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                        aria-hidden="true"/>}
                                    label={params.id ? 'View the current world state and record history as it is on the blockchain' : 'Not found'}
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
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
                    <div className="mt-2 mb-5 ">
                        <Descriptions
                            extra={
                                <div>
                                    <Button type="primary"
                                            onClick={async () => {
                                                const data = await queryStakeholders()
                                                updateExtrasState(Extras.STAKEHOLDERS, data)
                                                updateModalVisibilityState(ModalName.UPDATE_MODAL, true)
                                            }}>Modify Record
                                    </Button>
                                    <Button className={'ml-3'} danger type="primary"
                                            onClick={() => {
                                                showDeleteConfirm(
                                                    handleDelete,
                                                    'Delete User',
                                                    `${dataSetState[DataSetName.ONE_RESOURCE].name} will be permanently deleted from the system. This process can not be undone`
                                                )
                                            }}>Delete Record
                                    </Button>
                                </div>
                            }
                            title={(<p className="text-2xl"> Current State </p>)}
                            className={'text-2xl'}
                            items={extras[Extras.DESCRIPTION_ITEMS]}/>
                    </div>
                    {!dataSetState[DataSetName.ONE_RESOURCE] && !processingState[ProcessName.LOADING_ONE] ? (
                        <RecordNotFound redirectPath={"/dashboard/users"}/>
                    ) : (
                        <>
                            {dataSetState[DataSetName.ONE_RESOURCE] && <Form form={form}
                                                                             name="updateUser"
                                                                             labelCol={{ span: 8 }}
                                                                             wrapperCol={{ span: 16 }}
                                                                             style={{ maxWidth: 600 }}
                                                                             initialValues={{
                                                                                 stakeholderId: dataSetState[DataSetName.ONE_RESOURCE]?.stakeholderId,
                                                                                 fullName: dataSetState[DataSetName.ONE_RESOURCE]?.fullName,
                                                                                 username: dataSetState[DataSetName.ONE_RESOURCE]?.username,
                                                                                 role: dataSetState[DataSetName.ONE_RESOURCE]?.role,

                                                                             }}
                                                                             onFinish={() => alert('onFinish invoked')}
                                                                             onFinishFailed={() => alert('onFinishFailed invoked')}
                                                                             autoComplete="off">

                                <Modal
                                    title="Update User"
                                    open={modalVisibilityState[ModalName.UPDATE_MODAL]}
                                    onOk={handleUpdate}
                                    confirmLoading={false}
                                    onCancel={() =>{
                                        updateModalVisibilityState(ModalName.UPDATE_MODAL, false)
                                    }}>
                                    <Form.Item
                                        label="Fullname"
                                        name="fullName"
                                        rules={[{ required: true, message: 'Name can not be empty' }]}>
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
                                            {Object.values(Roles).map(s =>{
                                                return (<Select.Option key={s} value={s}> {s} </Select.Option>)
                                            })}
                                        </Select>
                                    </Form.Item>

                                    {extras[Extras.STAKEHOLDERS] && <Form.Item
                                        name="stakeholderId"
                                        label="Organization"
                                        rules={[{required: false, message: 'Select organization for the user'}]}>
                                        <Select placeholder="Select organization for the user">
                                            {extras[Extras.STAKEHOLDERS].map((s: any) => {
                                                return (<Select.Option key={s.id} value={s.id}> {s.name} </Select.Option>)
                                            })}
                                        </Select>
                                    </Form.Item>}
                                </Modal>
                            </Form>}
                        </>
                    )}

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
                            loading={processingState[ProcessName.LOADING_HISTORY]}
                            columns={columns}
                            dataSource={dataSetState[DataSetName.RESOURCE_HISTORY]}
                            onChange={() => console.log('Table changed')}
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
            </main>
        </div>
    );
}

