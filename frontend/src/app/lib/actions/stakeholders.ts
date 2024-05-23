import axios from 'axios';

export const queryStakeholders = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder` );
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching stakeholders');
  }
}

export const queryStakeholder = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting stakeholder record');
  }
}

export const queryStakeholderHistory = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/stakeholder/${id}/history` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting stakeholder record from blockchain');
  }
}

export const deleteStakeholder = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}` );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting stakeholder');
  }
}

export const updateStakeholder = async (id: string, data: any) => {
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/stakeholder/${id}`, data );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error updating stakeholder');
  }
}