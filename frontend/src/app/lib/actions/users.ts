import axios from 'axios';
import {getCookie} from "@/app/lib/actions/auth";

export const queryUsers = async () => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/user`,  {
      'headers': {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    });
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching users');
  }
}

export const queryUser = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}`,{
      'headers': {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting user record');
  }
}

export const queryUserHistory = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/user/${id}/history`,{
      'headers': {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting user record from blockchain');
  }
}

export const deleteUser = async (id: string) => {
  const cookies = await getCookie();

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}`, {
      'headers': {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting user');
  }
}

export const updateUser = async (id: string, data: any) => {
  const cookies = await getCookie();

  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}`, data, {
      'headers': {
        'accept': '*/*',
        'Authorization': `Bearer ${cookies.auth}`
      }
    } );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error updating user');
  }
}