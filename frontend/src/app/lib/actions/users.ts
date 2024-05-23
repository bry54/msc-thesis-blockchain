import axios from 'axios';

export const queryUsers = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/user` );
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching users');
  }
}

export const queryUser = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting user record');
  }
}

export const queryUserHistory = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/user/${id}/history` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting user record from blockchain');
  }
}

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}` );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting user');
  }
}

export const updateUser = async (id: string, data: any) => {
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/user/${id}`, data );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error updating user');
  }
}