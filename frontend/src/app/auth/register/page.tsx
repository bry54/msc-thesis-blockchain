'use client'

import Link from 'next/link';
import { register } from '@/app/lib/actions/auth';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const fields = [
  {
    label: 'Full name',
    type: 'text',
    id: 'fullName',
    autoComplete: ''
  },
  {
    label: 'Email Address',
    type: 'email',
    id: 'username',
    autoComplete: 'email'
  },
  {
    label: 'Password',
    type: 'password',
    id: 'password',
    autoComplete: ''
  },
  {
    label: 'Confirm Password',
    type: 'password',
    id: 'confirmPassword',
    autoComplete: ''
  },
]

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
      <>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
               alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register Account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
              initialValues={{ fullName: '', username: '', password: '', 'confirmPassword': '' }}
              validationSchema={Yup.object({
                fullName: Yup.string().required('Required'),
                username: Yup.string().required('Required'),
                password: Yup.string().required('Required'),
                ['confirmPassword']: Yup.string().required('Required').oneOf([Yup.ref('password')], 'Passwords must match'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                  await register(values);
                  router.push('/auth/login');
                } catch (err: any) {
                  setError(err.message);
                } finally {
                  setSubmitting(false);
                }
              }}
          >
            {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {fields.map((f) => (
                      <div key={f.id}>
                        <label
                            htmlFor={f.id}
                            className="block text-sm font-medium leading-6 text-gray-900">
                          {f.label}
                        </label>
                        <div className="mt-2">
                          <Field
                              id={f.id}
                              name={f.id}
                              type={f.type}
                              autoComplete={f.autoComplete}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <ErrorMessage name={f.id}
                                        className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium" component="p" />
                        </div>
                      </div>
                  ))}
                  {error && <div className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{error}</div>}
                  <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Sign in
                    </button>
                  </div>
                </Form>
            )}
          </Formik>

          <div className="text-sm mt-10 flex justify-between">
            <Link href="/auth/login" className="font-semibold text-yellow-600 hover:text-yellow-500">Login</Link>

            <a href="/auth/forgot-password" className="ml-5 font-semibold leading-6 text-green-600 hover:text-green-500 end-0">Forgot Password</a>
          </div>
        </div>
      </>
  )
}