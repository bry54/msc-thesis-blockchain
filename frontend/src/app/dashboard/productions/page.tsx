'use client'

import { HeaderButton, HeaderIconWithText } from '@/app/lib/components/header-items';
import { ArrowPathRoundedSquareIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Popconfirm, Table, TableColumnsType, Tag } from 'antd';
import { EllipsisMiddle, showDeleteConfirm } from '@/app/lib/components/CommonItems';
import Link from 'next/link';
import { CheckCircleOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { deleteProduction, queryProductions } from '@/app/lib/actions/productions';
import moment from 'moment';
import { deleteUser } from '@/app/lib/actions/users';

interface Processing {
  deleting: boolean,
  fetchingCollection: boolean
}

interface PopUps {
  deleteModal: {
    [key: string]: boolean
  },
  addModal: boolean
}

export default function SettingsPage() {

  const [processingState, setProcessingState] = useState<Processing>({ fetchingCollection: true, deleting: false });
  const [popUpState, setPopUpState] = useState<PopUps>({ deleteModal: {  }, addModal: false });
  const [collection, setCollection] = useState<any[]>([]);

  const updateProcessingState = (processName: 'deleting' | 'fetchingCollection', value: boolean) => {
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

  const fetchData = async () => {
    updateProcessingState('fetchingCollection', true)
    try {
      const data: any[] = await queryProductions();
      setCollection(data);
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
      await fetchData()
    } catch (error){
      console.error('Error deleting production:', error);
    } finally {
      updateProcessingState('deleting', false)
    }
  }

  useEffect(() => {
    fetchData();
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
      title: 'Planting',
      dataIndex: 'panting',
      key: 'planting',
      render: (data) => {
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.quantity || '--'} color="green" className={'mb-1'} /><br />
            <Badge text={data?.date || '--'} color="green" /><br />
          </div>
        );
      },
    },
    {
      title: 'Harvesting',
      dataIndex: 'harvesting',
      key: 'harvesting',
      render: (data) =>{
        if (!data)
          return (<Tag color="#f50">No Information</Tag>)
        return (
          <div className="text-sm font-medium">
            <Badge text={data?.quantity || '--'} color="orange" className={'mb-1'} /><br />
            <Badge text={data?.date || '--'} color="orange" /><br />
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
            <Badge text={rec?.notes || '--'} color="magenta" className={'mb-1'} /><br />
            <Badge text={rec?.date ? moment(rec?.date).fromNow() : '--'} color="magenta" /><br />
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
                clickHandler={fetchData}
              />

              <HeaderButton
                btnClasses="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                icon={<PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />}
                label="Add Product"
                clickHandler={() => alert('New product button clicked')}
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
              dataSource={collection}
              onChange={()=> console.log('On change operation')}
              showSorterTooltip={{ target: 'sorter-icon' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
