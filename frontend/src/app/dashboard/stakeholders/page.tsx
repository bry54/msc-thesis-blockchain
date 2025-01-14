'use client';
import React, {useEffect, useState} from 'react';
import {
  newStakeholderFields,
  OrganizationTypes,
} from '@/app/dashboard/stakeholders/definitions';
import {addStakeholder, deleteStakeholder, queryStakeholders} from '@/app/lib/actions/stakeholders';
import {Button, Modal, Table, TableColumnsType} from 'antd';
import {EllipsisMiddle, showDeleteConfirm} from '@/app/lib/components/CommonItems';
import Link from 'next/link';
import {DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import {HeaderButton, HeaderIconWithText} from '@/app/lib/components/header-items';
import {ArrowPathRoundedSquareIcon, BriefcaseIcon, PlusCircleIcon} from '@heroicons/react/20/solid';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {DataSetProps, ErrorProps, ModalVisibilityProps, ProcessingProps} from "@/app/lib/interfaces";
import {DataSetName, ModalName, ProcessName} from "@/app/lib/enums";
import {dataSetInitialState, errorsInitialState, modalsInitialState, processingInitialState} from "@/app/lib/constants";

export default function SettingsPage() {
  const [modalVisibilityState, setModalVisibilityState] = useState<ModalVisibilityProps>(modalsInitialState);
  const [processingState, setProcessingState] = useState<ProcessingProps>(processingInitialState);
  const [dataSetState, setDataSetState] = useState<DataSetProps>(dataSetInitialState);
  const [errorState, setError] = useState<ErrorProps>(errorsInitialState);

  const updateModalVisibilityState = (modalName: ModalName, visible: boolean) => {
    setModalVisibilityState((prevState: ModalVisibilityProps) => {
      return {
        ...prevState,
        [modalName]: visible
      }
    });
  }

  const updateProcessingState = (processName: ProcessName, status: boolean) => {
    setProcessingState((prevState: ProcessingProps) => {
      return {
        ...prevState,
        [processName]: status
      }
    });
  }

  const updateDataSetState = (dataSetName: DataSetName, data: any) => {
    setDataSetState((prevState: DataSetProps) => {
      return {
        ...prevState,
        [dataSetName]: data
      }
    });
  }

  const updateErrorState = (errName: ProcessName, data: any) => {
    setError((prevState: ErrorProps) => {
      return {
        ...prevState,
        [errName]: data
      }
    });
  }

  const fetchAllRecords = async () => {
    updateProcessingState(ProcessName.LOADING_ALL, true)
    try {
      const data: any[] = await queryStakeholders();
      updateDataSetState(DataSetName.ALL_RESOURCES, data)
    } catch (error: any) {
      //updateErrorState(ProcessName.LOADING_ALL, error.message)
      console.error('Error fetching stakeholders:', error);
    } finally {
      updateProcessingState(ProcessName.LOADING_ALL, false);
    }
  };

  const handleDeleteAction = async (id: string) => {
    updateProcessingState(ProcessName.DELETING_ONE, true)
    try {
      await deleteStakeholder(id);
      await fetchAllRecords()
    } catch (error){
      console.error('Error deleting stakeholder:', error);
    } finally {
      updateProcessingState(ProcessName.DELETING_ONE, false)
    }
  }

  useEffect(() => {
    fetchAllRecords();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const columns: TableColumnsType<any> = [
    {
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
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (<span className="text-sm font-medium">{ text } </span>),
      showSorterTooltip: { target: 'full-header' },
      filters: [], // specify the condition of filtering result
      onFilter: (value, record) => record.fullName.indexOf(value as string) === 0,
    }, {
      title: 'Organization Type',
      dataIndex: 'type',
      key: 'type',
      render: (data) => (<span className="text-sm font-medium">{ data ? data : '--' } </span>),
    }, {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (data) => (<span className="text-sm font-medium">{ data ? data : '--' } </span>),
    }, {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      render: (data) => (<span className="text-sm font-medium">{ data ? data : '--' } </span>),
      sorter: (a, b) => a.fullName.length - b.fullName.length,
    },{
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (data) => (<span className='flex justify-between'>
                <Link href={`/dashboard/stakeholders/${data.id}`}>
                    <Button type="primary" icon={<EyeOutlined />} size={'small'} title='View User'/>
                </Link>
            <Button danger type='primary' icon={<DeleteOutlined />} size={'small'} title='Delete User'
                    onClick={() => showDeleteConfirm(
                      ()=>handleDeleteAction(data.id),
                      'Are you sure want to Delete organization', `${data.name} will be permanently deleted from the system. This process can not be undone`
                    )}
            />
        </span>),
    },];

  return (
    <div className='text-neutral-950'>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2
                className="font-medium text-2xl leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Organizations Management
              </h2>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <HeaderIconWithText
                  icon={<BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                  aria-hidden="true" />}
                  label={'Manage organizations in the system'}
                />
              </div>
            </div>

            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <HeaderButton
                btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                label="Refresh"
                clickHandler={fetchAllRecords}
              />

              <HeaderButton
                btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                icon={<PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                label="New Organiztion"
                clickHandler={() => {
                  updateModalVisibilityState(ModalName.ADD_MODAL, true)
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Table
            scroll={{ x: 1500 }}
            loading={processingState[ProcessName.LOADING_ALL]}
            columns={columns}
            dataSource={dataSetState[DataSetName.ALL_RESOURCES]}
            onChange={() => {console.log('stakeholders table changed')}}
            showSorterTooltip={{ target: 'sorter-icon' }}
          />
        </div>

        <Formik
          initialValues={{ name: '', type: '', contactNumber: '', location: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Organization name can not be empty'),
            type: Yup.string().required('Organization can not be empty'),
            contactNumber: Yup.string().required('Phone number can not be empty'),
            location: Yup.string().required('Location can not be empty'),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            updateProcessingState(ProcessName.ADDING_ONE, true)
            updateErrorState(ProcessName.ADDING_ONE, null);
            try {
              await addStakeholder(values);
              updateModalVisibilityState(ModalName.ADD_MODAL, false);
              updateProcessingState(ProcessName.ADDING_ONE, false);
              await fetchAllRecords();
              resetForm()
            } catch (err: any) {
              updateErrorState(ProcessName.ADDING_ONE, err.message);
            } finally {
              updateProcessingState(ProcessName.ADDING_ONE, false)
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, submitForm }) => (
            <Modal
              title={
                <span className="mb-5">
                              <p className="text-xl font-medium">Add Organization</p>
                              <p className="text-sm font-light">Provide organization information.</p>
                              <hr className="mt-3 mb-3"></hr>
                          </span>
              }
              okText={'Save Organization'}
              open={modalVisibilityState[ModalName.ADD_MODAL]}
              onOk={submitForm}
              confirmLoading={processingState[ProcessName.ADDING_ONE]}
              onCancel={() => updateModalVisibilityState(ModalName.ADD_MODAL, false)}>
              <Form className="space-y-6">
                {newStakeholderFields.map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="block text-sm font-medium leading-6 text-gray-900">
                      {f.label}
                    </label>
                      <div className='mt-2'>
                        <Field name={f.id}>
                          {(props: any) => {
                            const { field, form, meta } = props;
                            if (f.id == 'type') {
                              return (
                                <>
                                  <select
                                    {...field}
                                    id={f.id}
                                    name={f.id}
                                    autoComplete="none"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                    <option key={'default'}
                                            value={''}>{'Select organization type'}</option>
                                    <option key={'set-null'}
                                            value={undefined}>{'--'}</option>
                                    {Object.values(OrganizationTypes).map((s: any) => (
                                      <option key={s.id}
                                              value={s}>{s}</option>
                                    ))}
                                  </select>
                                  {meta.touched &&
                                    meta.error && <div
                                      className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{meta.error}</div>}
                                </>
                              )
                            } else {
                              return (
                                <>
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
                                </>
                              )
                            }
                          }}
                        </Field>
                      </div>
                  </div>
                ))}
                {errorState[ProcessName.ADDING_ONE] &&
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{errorState[ProcessName.ADDING_ONE]}</div>}
              </Form>
              <div className="mt-6 mb-6"></div>
            </Modal>
          )}
        </Formik>
      </main>
    </div>
  );
}
