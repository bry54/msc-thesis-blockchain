
'use client'

import { HeaderButton, HeaderIconWithText } from '@/app/lib/components/header-items';
import { ArrowPathRoundedSquareIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { Badge, Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Table, TableColumnsType, Tag } from 'antd';
import { EllipsisMiddle, showDeleteConfirm } from '@/app/lib/components/CommonItems';
import Link from 'next/link';
import { CheckCircleOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { addProduction, deleteProduction, queryProductions } from '@/app/lib/actions/productions';
import moment from 'moment';
import { queryStakeholders } from '@/app/lib/actions/stakeholders';

const { Option } = Select

interface Processing {
  deleting: boolean,
  adding: boolean
  fetchingCollection: boolean
}

interface PopUps {
  deleteModal: {
    [key: string]: boolean
  },
  addModal: boolean
}

interface Collections {
  productsList: any[],
  stakeholders: any[]
}

export default function SettingsPage() {

  const [processingState, setProcessingState] = useState<Processing>({ fetchingCollection: true, deleting: false, adding: false });
  const [popUpState, setPopUpState] = useState<PopUps>({ deleteModal: {  }, addModal: false });
  const [collectionState, setCollectionState] = useState<Collections>({ productsList:[], stakeholders:[] });
  const [form] = Form.useForm();

  const updateCollectionsState = (collectionName: 'productsList' | 'stakeholders', data: any) => {
    setCollectionState({
      ...collectionState,
      [collectionName]: data
    });
  }

  const updateProcessingState = (processName: 'deleting' | 'fetchingCollection' | 'adding', value: boolean) => {
    setProcessingState({
      ...processingState,
      [processName]: value
    });
  }

  const updatePopsState = (popUpName: 'deleteModal' | 'addModal', value: boolean, id: string) => {
    if (popUpName=='deleteModal'){
      setPopUpState({
        ...popUpState,
        deleteModal: {
          ...popUpState.deleteModal,
          [id]: value
        }
      });
    } else {
      setPopUpState({
        ...popUpState,
        [popUpName]: value

      })
    }

  }

  const fetchStakeholders = async () => {
    updateProcessingState('fetchingCollection', true)
    try {
      const data: any[] = await queryStakeholders();
      updateCollectionsState('stakeholders', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      updateProcessingState('fetchingCollection', false)
    }
  };

  const fetchProducts = async () => {
    updateProcessingState('fetchingCollection', true)
    try {
      const data: any[] = await queryProductions();
      updateCollectionsState('productsList', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      updateProcessingState('fetchingCollection', false)
    }
  };

  const handleRecordDelete = async (recordId: string) =>{
    updateProcessingState('deleting', true)
    try {
      await deleteProduction(recordId)
      await fetchProducts()
    } catch (error){
      console.error('Error deleting production:', error);
    } finally {
      updateProcessingState('deleting', false)
    }
  }

  const handleRecordAdd = async () =>{
    const values: any = form.getFieldsValue();
    const initialPlace = collectionState.stakeholders.find((s: any) => s.id == values.origin)

    const product = {
      name: values.name,
      category: values.type
    }

    const {id, name, type, location, contactNumber} = initialPlace;

    const origin = {id, name, type, location, contactNumber}

    const planting = {
      quantity: values.quantity,
      date: values.plantingDate
    }

    updateProcessingState('adding', true)

    try {
      await addProduction({ product, origin, planting })
      await fetchProducts()
      form.resetFields();
      updatePopsState('addModal', false, '')
    } catch (error){
      console.error('Error Adding production:', error);
    } finally {
      updateProcessingState('adding', false)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const columns: TableColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
      render: (text) => (
        <EllipsisMiddle
          suffixCount={8}
          textClasses="text-sm font-bold">
          { text }
        </EllipsisMiddle>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (data) => {
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.name || '--'} color="geekblue" className={'mb-1'} /><br />
            <Badge text={data?.category || '--'} color="geekblue" /><br />
          </div>
        );
      },
      showSorterTooltip: { target: 'full-header' },
    },
    {
      title: 'Origin Information',
      dataIndex: 'origin',
      key: 'origin',
      render: (data) => {
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.name || '--'} color="purple" className={'mb-1'} /><br />
            <Badge text={data?.location || '--'} color="purple" /><br />
          </div>
        );
      },
    },
    {
      title: 'Planted On',
      dataIndex: 'planting',
      key: 'planting',
      width: 150,
      render: (data) => {
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.quantity || '--'} color="green" className={'mb-1'} /><br />
            <Badge text={data?.date ? moment(data.date).format("MMMM Do YYYY"): '--'} color="green" /><br />
          </div>
        );
      },
    },
    {
      title: 'Harvested On',
      dataIndex: 'harvesting',
      key: 'harvesting',
      render: (data) =>{
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.quantity || '--'} color="orange" className={'mb-1'} /><br />
            <Badge text={data?.date ? moment(data.date).format("MMMM Do YYYY"): '--'} color="orange" /><br />
          </div>
        )
      },
    },
    {
      title: 'Latest Regulatory Checks',
      dataIndex: 'regulatoryChecks',
      key: 'regulatoryChecks',
      render: (data) => {
        const sorted = (data || []).sort((a:any, b:any) => new Date(b.date) - new Date(a.date));
        const rec = sorted[0] || null
        if (!rec)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={rec?.date ? moment(rec?.date).fromNow() : '--'} color="magenta" className={'mb-1'}/><br />
            {rec?.notes}
          </div>
        );
      },
    },
    {
      title: 'Latest Transportation Information',
      dataIndex: 'transportationDetail',
      key: 'transportationDetail',
      render: (data) => {
        const sorted = (data || []).sort((a:any, b:any) => new Date(b.departure.date) - new Date(a.departure.date));
        const rec = sorted[0] || null
        if (!rec)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            {
              rec?.destination?.responsiblePerson ? (
                <>
                  <Tag icon={<CheckCircleOutlined />} color="success" className={'mb-1'}>
                    FROM: { rec?.departure?.name}
                  </Tag><br/>
                </>
              ) : (
                <>
                  <Tag icon={<SyncOutlined spin />} color="processing" className={'mb-1'}>
                    FROM { rec?.departure?.name}
                  </Tag><br/>
                </>
              )
            }

            {
              rec?.departure?.responsiblePerson ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  TO { rec?.destination?.name}
                </Tag>
              ) : (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  TO { rec?.destination?.name}
                </Tag>
              )
            }
          </div>
        )
      },
    },
    {
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (data) => (
        <div className="flex justify-between">
          <Link href={`/dashboard/productions/${data.id}`}>
            <Button type="primary" icon={<EyeOutlined />} size={'small'} title='View Record'/>
          </Link>
          <Popconfirm
            title="Delete Record"
            description={`Delete record ${data.id}`}
            open={popUpState.deleteModal[data.id]}
            onConfirm={() => handleRecordDelete(data.id)}
            okButtonProps={{ loading: processingState.deleting }}
            onCancel={()=> updatePopsState('deleteModal', false, data.id)}>
            <Button danger type='primary' icon={<DeleteOutlined />} size={'small'} title='Delete Record'
                    onClick={() => updatePopsState('deleteModal', true, data.id)}
            />
          </Popconfirm>

        </div>),
    },];

  return (
    <div className='text-neutral-950'>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2
                className="font-medium text-2xl leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Productions Management
              </h2>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <HeaderIconWithText
                  icon={<BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                       aria-hidden="true" />}
                  label={'Manage products in the system'}
                />
              </div>
            </div>

            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <HeaderButton
                btnClasses="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                icon={<ArrowPathRoundedSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                label="Refresh"
                clickHandler={fetchProducts}
              />

              <HeaderButton
                btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                icon={<PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                label="Add Product"
                clickHandler={ async () => {
                  await fetchStakeholders();
                  updatePopsState('addModal', true, '');
                }}
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Table
              scroll={{ x: 1500 }}
              loading={processingState.fetchingCollection}
              columns={columns}
              dataSource={collectionState.productsList}
              onChange={()=> console.log('On change operation')}
              showSorterTooltip={{ target: 'sorter-icon' }}
            />


            <Form form={form}
                  name="addProduct"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                  onFinish={() => alert('onFinish invoked')}
                  onFinishFailed={() => alert('onFinishFailed invoked')}
                  autoComplete="off">

              <Modal
                title="Add new product"
                open={popUpState.addModal}
                onOk={handleRecordAdd}
                confirmLoading={processingState.adding}
                onCancel={() => updatePopsState('addModal', false, '')}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input product name' }]}>
                  <Input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>

                <Form.Item
                  label="Product Type"
                  name="type"
                  rules={[{ required: true, message: 'Please input product type' }]}>
                  <Input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>

                <Form.Item
                  label="Planting Date"
                  name="plantingDate"
                  rules={[{ required: true, message: 'Please input day of planting' }]}>
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  label="Quantity Planted"
                  name="quantity"
                  rules={[{ required: true, message: 'Please input quantity planted' }]}>
                  <Input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>

                <Form.Item
                  name="origin"
                  label="Origin"
                  rules={[{ required: true, message: 'Please select origin!' }]}>
                  <Select placeholder="select product origin">
                    {collectionState.stakeholders.map(s =>{
                      return (<Option key={s.id} value={s.id}> {s.name} </Option>)
                    })}
                  </Select>
                </Form.Item>
              </Modal>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
