'use client';

import React, {useEffect, useState} from 'react';
import {Button, Modal, Table, TableColumnsType, TableProps} from 'antd';
import {ArrowPathRoundedSquareIcon, PlusCircleIcon, UserIcon,} from '@heroicons/react/20/solid';
import {HeaderButton, HeaderIconWithText} from '@/app/lib/components/header-items';
import {deleteUser, queryUsers} from '@/app/lib/actions/users';
import {EllipsisMiddle, showDeleteConfirm} from '@/app/lib/components/CommonItems';
import * as Yup from 'yup';
import {register} from '@/app/lib/actions/auth';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {fields} from "@/app/dashboard/users/definitions";
import {redirect} from "next/navigation";
import Link from "next/link";

interface DataType {
    //key: React.Key
    id: string,
    fullName: string,
    username: string
}

interface Modals {
    addModal: boolean,
    deleteModal: boolean
}

interface UsersQueryResponse {
    "data": [],
    "count": number,
    "total": number,
    "page": number,
    "pageCount": number
}



export default function UsersPage() {

    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<Modals>({ addModal: false, deleteModal: false });
    const [confirmLoading, setConfirmLoading] = useState<Modals>({ addModal: false, deleteModal: false });
    const [error, setError] = useState<string | null>(null);


    const fetchData = async () => {
        setLoading(true)
        try {
            const data: DataType[] = await queryUsers();
            setData(data);
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
            await fetchData()
        } catch (error){
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false)
        }
    }

    const showModal = (modalName: 'addModal' | 'deleteModal') => {
        setOpen({
            ...open,
            [modalName]: true
        });
    };

    const handleCancel = (modalName: 'addModal' | 'deleteModal') => {
        console.log('Clicked cancel button');
        setOpen({
            ...open,
            [modalName]: false
        });
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once after the initial render


    const columns: TableColumnsType<DataType> = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (text) => (<span className="text-sm font-medium">{ text } </span>),
        showSorterTooltip: { target: 'full-header' },
        filters: [], // specify the condition of filtering result
        onFilter: (value, record) => record.fullName.indexOf(value as string) === 0,
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    }, {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        render: (text) => (<span className="text-sm font-medium">{ text } </span>),
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    }, {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (text) => (<span className="text-sm font-medium">{ text } </span>),
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    }, {
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization',
        render: (text) => (<span className="text-sm font-medium">{ text } </span>),
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    },{
        title: 'Actions',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (data) => (<span className='flex justify-between'>

                <Link href={`/dashboard/users/${data.id}`}>
                    <Button type="primary" icon={<EyeOutlined />} size={'small'} title='View User'/>
                </Link>
            <Button danger type='primary' icon={<DeleteOutlined />} size={'small'} title='Delete User'
                    onClick={() => showDeleteConfirm(
                      ()=>handleUserDelete(data.id),
                      'Are you sure want to Delete User', `${data.fullName} will be permanently deleted from the system. This process can not be undone`
                    )}
            />
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
                          Users Management
                      </h2>
                      <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                          <HeaderIconWithText
                            icon={<UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                            aria-hidden="true" />}
                            label={'Some label'}
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
                        clickHandler={() => showModal('addModal')}
                      />
                  </div>
              </div>
          </header>

          <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                  <Table
                    scroll={{ x: 1500 }}
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    onChange={onChange}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                  />
              </div>


              <Formik
                initialValues={{ fullName: '', username: '', password: '', 'confirmPassword': '' }}
                validationSchema={Yup.object({
                    fullName: Yup.string().required('Required'),
                    username: Yup.string().required('Required'),
                    password: Yup.string().required('Required'),
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setConfirmLoading({
                        ...confirmLoading,
                        addModal: true
                    });
                    setError(null);
                    try {
                        await register(values);
                        setOpen({
                            ...open,
                            addModal: false
                        });
                        setConfirmLoading({
                            ...confirmLoading,
                            addModal: false
                        });
                        fetchData()
                        resetForm()
                        //router.push('/auth/login');
                    } catch (err: any) {
                        setError(err.message);
                    } finally {
                        setConfirmLoading({
                            ...confirmLoading,
                            addModal: false
                        })
                        setSubmitting(false);
                    }
                }}
              >
                  {({ isSubmitting, submitForm }) => (
                    <Modal
                      title={
                          <span className="mb-5">
                              <p className="text-xl font-medium">Add User</p>
                              <p className="text-sm font-light">Provide user information & default password.</p>
                              <hr className="mt-3 mb-3"></hr>
                          </span>
                      }
                      okText={'Save User'}
                      open={open.addModal}
                      onOk={submitForm}
                      confirmLoading={confirmLoading.addModal}
                      onCancel={() => handleCancel('addModal')}>
                        <Form className="space-y-6">
                            {fields.map((f) => (
                              <div key={f.id}>
                                  <label
                                    htmlFor={f.id}
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                      {f.label}
                                  </label>
                                  <div className="mt-2">
                                      <Field
                                        id={f.id}
                                        name={f.id}
                                        type={f.type}
                                        autoComplete={f.autoComplete}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      <ErrorMessage name={f.id}
                                                    className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium"
                                                    component="p" />
                                  </div>
                              </div>
                            ))}
                            {error &&
                              <div className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{error}</div>}
                        </Form>
                        <div className="mt-6 mb-6"></div>
                    </Modal>
                  )}
              </Formik>
          </main>
      </div>
    );
}

