import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'

const AUTH_USER = gql`
    mutation authUser($input: InputAuth) {
      authUser(input: $input) {
        token
      }
  }
`;

const Login = () => {
  const router = useRouter();

  const [message, saveMessage] = useState(null);

  const [authUser] = useMutation(AUTH_USER);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('The email is invalid')
        .required('The email is necessary'),
      password: Yup.string()
        .required('The password is necessary')
    }),
    onSubmit: async values => {
      const { email, password } = values;

      try {
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password
            }
          }
        });
        saveMessage('Authenticating...');

        setTimeout(() => {
          const { token } = data.authUser;
          localStorage.setItem('token', token);
        }, 1000);

        setTimeout(() => {
          saveMessage(null);
          router.push('/');
        }, 2000);

      } catch (error) {
        saveMessage(error.message.replace('GraphQL error: ', ''));

        setTimeout(() => {
          saveMessage(null);
        }, 3000);
      }
    }
  })

  const showMessage = () => {
    return (
      <div className="transition easy-in bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    )
  }


  return (
    <Layout>
      <section className="column justify-center bg-gray-800 w-full pt-5">
        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        {message && showMessage()}

        <div className="flex justify-center pt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="User Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>

              {formik.touched.email && formik.errors.email ? (
                <div className={"my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"} >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="User Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase cursor-pointer hover:bg-gray-900"
                value="Iniciar Sesi??n"
              />
            </form>
            <p className="text-center text-gray-200 text-s">
              You don't have an account?{' '}
              <Link href="/new-account"><a className="block font-bold hover:underline ">Create one</a></Link>
            </p>
            {message && <img  className="animate-spin w-7 m-auto" src="/favicon.ico" alt="versel logo spiner" />}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Login;
