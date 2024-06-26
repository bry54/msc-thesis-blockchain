import axios from 'axios';
import {getCookie} from "@/app/lib/actions/auth";

export const queryProductions = async () => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production`,{
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching productions');
  }
}

export const queryProduction = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}`,{
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting production record');
  }
}

export const queryProductHistory = async (id: string) => {
  const cookies = await getCookie();
  const uri = `${process.env.NEXT_PUBLIC_API_HOST}/rec-compare`;

  try {
    const response = await axios.get(uri/*`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/production/${id}/history`*/,{
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

export const deleteProduction = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}`,{
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting production');
  }
}

export const updateProduction = async (id: string, data: any) => {
  const cookies = await getCookie();

  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}`, data, {
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

export const addProduction = async (values: any) => {
  const cookies = await getCookie();

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/production`, values, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error adding production');
  }
}