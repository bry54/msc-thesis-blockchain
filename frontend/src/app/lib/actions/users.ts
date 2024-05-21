import axios from 'axios';

export const queryUsers = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users` );
    return  response.data.data.map((d: any) => ({ key: d.id, ...d }))
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Login failed');
  }
}

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/users/${id}` );
    return response.data
  } catch (e: any){
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Login failed');
  }
}