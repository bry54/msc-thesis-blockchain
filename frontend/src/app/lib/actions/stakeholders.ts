import axios from 'axios';
import {getCookie} from "@/app/lib/actions/auth";

export const queryStakeholders = async () => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder`, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching stakeholders');
  }
}

export const queryStakeholder = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}`, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies?.auth}`
      }
    } );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting stakeholder record');
  }
}

export const queryStakeholderHistory = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/stakeholder/${id}/history`,{
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting stakeholder record from blockchain');
  }
}

export const deleteStakeholder = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}`, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting stakeholder');
  }
}

export const updateStakeholder = async (id: string, data: any) => {
  const cookies = await getCookie();

  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}`, data, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error updating stakeholder');
  }
}

export const addStakeholder = async (data: any) => {
  const cookies = await getCookie();

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder`, data, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error adding stakeholder');
  }
}