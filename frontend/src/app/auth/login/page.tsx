'use client';

import Link from 'next/link';
import {login} from '@/app/lib/actions/auth';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import * as Yup from 'yup';

const fields = [
  {
    label: 'Username',
    type: 'text',
    id: 'username',
    autoComplete: 'username',
  },
  {
    label: 'Password',
    type: 'password',
    id: 'password',
    autoComplete: 'current-password',
  },
];

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            try {
              await login(values);
              router.push('/dashboard/users');
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
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
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
                    <ErrorMessage
                      className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium"
                      name={f.id} component="p" />
                  </div>
                </div>
              ))}
              {error && <div className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">{error}</div>}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-sm mt-10 flex justify-between">
          <Link href="/auth/forgot-password" className="font-semibold text-yellow-600 hover:text-yellow-500">
            Forgot password?
          </Link>

          <Link href="/auth/register" className="ml-5 font-semibold leading-6 text-green-600 hover:text-green-500">
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
}
