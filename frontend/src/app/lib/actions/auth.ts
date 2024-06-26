'use server';

import axios from 'axios';
import {SignInResponseDto} from '@/app/lib/interfaces';
import {cookies} from 'next/headers';

export const login = async (formData: Record<string, any>) => {

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, {...formData, agent: 'WEB'});
    await createSession(response.data);
    return response.data;
  } catch (e: any) {
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Login failed');
  }
}

export const logout = async ( ) => {
  try {
    await deleteSession()
  } catch (e: any) {
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Logout failed');
  }
}

export const register = async (formData: Record<string, any>) => {
  delete formData.confirmPassword;

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/register`, formData);
    //await createSession(response.data);
    return response.data;
  } catch (e: any) {
    console.log(e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Registration failed');
  }
}


export async function createSession(dto: SignInResponseDto) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookies().set('Auth', dto.accessToken, {
    //httpOnly: true,
    //secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  cookies().getAll().map((c: any) =>{
    cookies().delete(c.name)
  })
}

export async function getCookie () {
  const cookieStore = cookies();

  return {
    auth: cookieStore.get('Auth')?.value
  }
}
