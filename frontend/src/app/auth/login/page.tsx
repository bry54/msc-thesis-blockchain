'use client'
import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { useActionState } from 'react';
import { useFormik } from 'formik';

export default function LoginPage() {

  const fields = [
    {
      label: 'Username',
      type: 'text',
      id: 'username',
      autoComplete: ''
    },
    {
      label: 'Password',
      type: 'password',
      id: 'password',
      autoComplete: ''
    }
  ];

  const formik = useFormik({
    initialValues: {
      username: '', password: '', agent: 'WEB'
    },
    onSubmit: async (values) => {
      const response = await login(values)
      alert(JSON.stringify(response.data));
    }
  });

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
               alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
          account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {fields.map(f => {
            return (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-sm font-medium leading-6 text-gray-900">{f.label}</label>
                <div className="mt-2">
                  <input
                    id={f.id}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    {...formik.getFieldProps(f.id)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
            );
          })
          }

          <div>
            <button type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
          </div>
        </form>

        <div className="text-sm mt-10 flex justify-between">
          <Link href="/auth/forgot-password" className="font-semibold text-yellow-600 hover:text-yellow-500">Forgot password?</Link>

          <a href="/auth/register" className="ml-5 font-semibold leading-6 text-green-600 hover:text-green-500 end-0">Create Account</a>
        </div>
      </div>
    </>
  )
}