'use client';

import { HeaderButton, HeaderIconWithText } from '@/app/lib/components/header-items';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import {
  Badge,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Modal, QRCode,
  Select,
  Table,
  TableColumnsType,
  Tabs,
  Tag,
} from 'antd';
import Link from 'next/link';
import {
  AimOutlined,
  BarcodeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InfoOutlined,
  LeftOutlined, VerifiedOutlined,
} from '@ant-design/icons';
import {
  deleteProduction,
  queryProductHistory,
  queryProduction,
  updateProduction,
} from '@/app/lib/actions/productions';
import moment from 'moment/moment';
import {addSummaries, convertTimestampToLocalTime} from '@/app/lib/helpers';
import { EllipsisMiddle } from '@/app/lib/components/CommonItems';
import { queryStakeholders } from '@/app/lib/actions/stakeholders';
import {RegulatoryChecks} from "@/app/details/partials/overview/regulatory-checks";
import {TransportationDetails} from "@/app/details/partials/overview/transportation-details";
import {PricingDetails} from "@/app/details/partials/overview/pricing-details";
import {compareRecords, Summary, SummaryRecord} from "@/app/lib/data-aggragation";

interface Processing {
  deleting: boolean,
  fetchingHistory: boolean,
  fetchingRecord: boolean,
  updating: boolean
}

interface PopUps {
  deleteModal: boolean,
  editModal: boolean
}

interface Collections {
  product: any,
  history: any[],
  stakeholders: any[],
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {

  const [processingState, setProcessingState] = useState<Processing>({ deleting: false, fetchingHistory: false, fetchingRecord: false, updating: false });
  const [popUpState, setPopUpState] = useState<PopUps>({ deleteModal: false, editModal: false });
  const [collectionState, setCollectionState] = useState<Collections>({ product:null, history:[], stakeholders:[] });
  const [form] = Form.useForm();

  const updateCollectionsState = (collectionName: 'product' | 'history' | 'stakeholders', data: any) => {
    setCollectionState((prevState) => {
      return {
        ...prevState,
        [collectionName]: data
      };
    });
  }

  const updateProcessingState = (processName: 'deleting' | 'fetchingHistory' | 'fetchingRecord' | 'updating', value: boolean) => {
    setProcessingState((prevState) => {
      return {
        ...prevState,
        [processName]: value
      }
    });
  }

  const updatePopsState = async (popUpName: 'deleteModal' | 'addModal' | 'editModal', value: boolean, id: string) => {
    console.log(collectionState);
    if (popUpName == 'editModal' && value){
      const stakeholders = await queryStakeholders();
      updateCollectionsState('stakeholders', stakeholders)
    }

    setPopUpState((prevState) => {
      return {
        ...popUpState,
        [popUpName]: value
      }
    })
  }

  const fetchHistory = async () => {
    const id = params.id;
    updateProcessingState('fetchingHistory', true)
    try {
      const data: any[] = await queryProductHistory(id)
      const withSummary = compareRecords(data).map(d => ({ key: d.TxId, ...d}))
      updateCollectionsState('history', withSummary);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      updateProcessingState('fetchingHistory', false)
    }
  };

  const fetchProduct = async () => {
    const id = params.id
    updateProcessingState('fetchingRecord', true)
    try {
      const data = await queryProduction(id);
      updateCollectionsState('product', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      updateProcessingState('fetchingRecord', false)
    }
  };

  const handleRecordUpdate = async () =>{
    const pId = params.id
    updateProcessingState('updating', true)
    try {
      const values: any = form.getFieldsValue();
      const initialPlace = collectionState.stakeholders.find((s: any) => s.id == values.stakeholderId)

      const product = {
        name: values.name,
        category: values.category
      }

      const {id, name, type, location, contactNumber} = initialPlace;

      const origin = {id, name, type, location, contactNumber}

      const planting = {
        quantity: values.quantity,
        date: values.plantingDate
      }

      const stateProduct: any = {...collectionState.product };

      const data = {
        product: {
          ...stateProduct.product,
          ...product
        },
        planting: {
          ...stateProduct.planting,
          ...planting
        },
        origin: {
          ...stateProduct.origin,
          ...origin
        }
      }

      await updateProduction(pId, data)
      await fetchProduct()
      await fetchHistory()

      updateProcessingState('updating', false)
      updatePopsState('editModal', false, '')
    } catch (error){
      console.error('Error updating production:', error);
    } finally {
      updateProcessingState('deleting', false)
    }
  }

  useEffect(() => {
    fetchProduct();
    fetchHistory()
  }, []); // Empty dependency array means this effect runs once after the initial render

  const columns: TableColumnsType<any> = [{
    title: 'Transaction Id',
    dataIndex: 'TxId',
    key: 'TxId',
    filters: [],
    width: '100%',
    render: (data) => (
        <EllipsisMiddle
            suffixCount={8}
            textClasses="text-sm font-bold font-mono">
          { data }
        </EllipsisMiddle>
    ),
  }];

  return (
      <div className='text-neutral-950'>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2
                    className="font-medium text-2xl leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Product History
                </h2>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <HeaderIconWithText
                      icon={<BarcodeOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 font-mono"
                                             aria-hidden="true" />}
                      label={collectionState?.product?.id || '--'}
                  />
                  <HeaderIconWithText
                      icon={<InfoOutlined className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                          aria-hidden="true" />}
                      label={collectionState?.product?.product?.name || '--'}
                  />
                </div>
              </div>

              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <Link href='/dashboard/productions'>
                  <HeaderButton
                      btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      icon={<LeftOutlined className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                      label="Back"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="h-full">
              <div className="">
                <div className="flex">
                  <div className="flex-none w-1/3">
                    <Card
                        style={{ width: 300 }}
                        cover={
                          <QRCode
                              style={{ width: '100%', height: '100%' }}
                              icon={'/assets/thesis-logo.png'}
                              value={collectionState?.product?.id || '--'}
                              bgColor={'#ececec'}
                              iconSize={24}
                          />
                        }
                        actions={[
                          <EditOutlined key="edit" color={'blue'} onClick={() => updatePopsState('editModal', true, '')}/>,
                          <DeleteOutlined key="setting" color={'red'}/>,
                        ]}
                    >
                      <Card.Meta
                          title={collectionState?.product?.product?.name}
                          description={(
                              <>
                                Category: {collectionState?.product?.product?.category}<br />
                                Planted On: {moment(collectionState?.product?.planting?.date).format("MMMM Do YYYY") }<br />
                                Origin: {collectionState?.product?.origin?.name}<br />
                              </>
                          )}
                      />
                    </Card>
                  </div>
                  <div className="flex-initial w-2/3 mb-10">
                    {collectionState?.product && <Tabs
                        defaultActiveKey="1"
                        items={[
                          {
                            label: 'Regulatory Checks',
                            key: 'regulatoryChecks',
                            children: <RegulatoryChecks
                                productId={null}
                                theProduct={collectionState?.product}
                            />,
                          },
                          {
                            label: 'Transportation Information',
                            key: 'transportationDetail',
                            children: <TransportationDetails
                                productId={null}
                                theProduct={collectionState?.product}
                            />,
                          },
                          {
                            label: 'Pricing Information',
                            key: 'pricingDetail',
                            children: <PricingDetails
                                productId={null}
                                theProduct={collectionState?.product}
                            />,
                          },
                        ]}
                    />
                    }
                  </div>
                </div>
              </div>

              {collectionState.product && (<Form form={form}
                                                 name="updateProduct"
                                                 labelCol={{ span: 8 }}
                                                 wrapperCol={{ span: 16 }}
                                                 style={{ maxWidth: 600 }}
                                                 initialValues={{
                                                   name: collectionState.product.product.name,
                                                   category: collectionState.product.product.category,
                                                   //plantingDate: collectionState.product?.planting?.date ? moment(collectionState.product.planting.date).format("MMMM Do YYYY") : null,
                                                   quantity: collectionState.product?.planting?.quantity,
                                                   stakeholderId: collectionState.product?.origin?.id,
                                                 }}
                                                 onFinish={() => alert('onFinish invoked')}
                                                 onFinishFailed={() => alert('onFinishFailed invoked')}
                                                 autoComplete="off">

                <Modal
                    title="Update Product Information"
                    open={popUpState.editModal}
                    onOk={handleRecordUpdate}
                    confirmLoading={processingState.updating}
                    onCancel={() => updatePopsState('editModal', false, '')}>
                  <Form.Item
                      label="Product Name"
                      name="name"
                      rules={[{ required: true, message: 'Type to override product name' }]}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </Form.Item>

                  <Form.Item
                      label="Product Type"
                      name="category"
                      rules={[{ required: true, message: 'Type to override product type' }]}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </Form.Item>

                  <Form.Item
                      label="Planting Date"
                      name="plantingDate"
                      rules={[{ required: true, message: 'Select to override planting data' }]}>
                    <DatePicker format='YYYY-MM-DD'/>
                  </Form.Item>

                  <Form.Item
                      label="Quantity Planted"
                      name="quantity"
                      rules={[{ required: true, message: 'Type to override quantity planted ' }]}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </Form.Item>

                  <Form.Item
                      name="stakeholderId"
                      label="Origin"
                      rules={[{ required: true, message: 'Please select origin!' }]}>
                    <Select placeholder="select product origin">
                      {collectionState.stakeholders.map(s => {
                        return (<Select.Option key={s.id} value={s.id}> {s.name} </Select.Option>);
                      })}
                    </Select>
                  </Form.Item>
                </Modal>
              </Form>)}

              <div className="">
                <Divider orientation="left"><p className={'text-2xl font-medium'}>Record History on blockchain</p></Divider>
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
                                clickHandler={fetchHistory}
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
                    loading={processingState.fetchingHistory}
                    columns={columns}
                    dataSource={collectionState.history as SummaryRecord[]}
                    onChange={() => console.log('table changed')}
                    showSorterTooltip={{target: 'sorter-icon'}}
                    expandable={{
                      expandedRowRender: (record: SummaryRecord) => {
                        const summaries = record.Summaries

                        const data = Object.keys(summaries).map(k => {
                          return {
                            key: k,
                            data: summaries[k]
                          }
                        })
                        return (
                            <div>
                              <List
                                  header={
                                    <ol className={'text-sm font-medium font-mono'} style={{lineHeight: 1.75}}>
                                      {
                                        summaries.map((s: Summary, index) => {
                                          const keys = Object.keys(s)
                                          const data = keys.map((k) => (s[k]))

                                          if (Array.isArray(data)) {
                                            return data.map((inner, iIndex) => {
                                              if (Array.isArray(inner)) {
                                                return inner.map((s, sIndex) => (
                                                    <li key={sIndex}>
                                                      &bull; <code>{JSON.stringify(s)}</code>
                                                    </li>
                                                ))
                                              }
                                              return (
                                                  <li key={iIndex}>
                                                    &bull; <code>{JSON.stringify(inner)}</code>
                                                  </li>
                                              )
                                            })
                                          } else {
                                            return (
                                                <li key={index}> &bull;
                                                  <code>{JSON.stringify(data)}</code>
                                                </li>
                                            )
                                          }
                                        })
                                      }
                                    </ol>
                                  }
                                  bordered
                                  dataSource={data}
                                  renderItem={(item) => (
                                      <Badge.Ribbon className='text-sm font-medium font-mono' text={convertTimestampToLocalTime(record?.Timestamp as {nanos: number, seconds: number})}>
                                        <List.Item className='text-sm font-medium font-mono'>
                                          <Tag color="geekblue"
                                               icon={
                                                 <VerifiedOutlined size={2}/>}
                                          ></Tag>
                                        </List.Item>
                                      </Badge.Ribbon>

                                  )}
                              />
                            </div>
                        )
                      },
                      rowExpandable: (record: SummaryRecord) => record.Summaries.length != 0 ,
                    }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
