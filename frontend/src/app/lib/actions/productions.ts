import axios from 'axios';

export const queryProductions = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production` );
    return response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error fetching productions');
  }
}

export const queryProduction = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting production record');
  }
}

export const queryProductHistory = async (id: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST_BLOCKCHAIN}/production/${id}/history` );
    return  response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error getting stakeholder record from blockchain');
  }
}

export const deleteProduction = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}` );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error deleting production');
  }
}
export const updateProduction = async (id: string, data: any) => {  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/production/${id}`, data );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error updating stakeholder');
  }
}

export const addProduction = async (values: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/production`, values );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Error adding production');
  }
}