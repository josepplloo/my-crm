import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_CLIENT = gql`
    mutation newClient($input: InputClient) {
        newClient(input: $input) {
          id
          name
          surname
          email
          company
          telephone
        }
    }
`;

const GET_CLIENTS_BY_USER = gql`
query GetClientsByUser {
  getClientsByUser {
    id
    name
    surname
    email
    company
  }
}
`


const NewClient = () => {
  const [message, saveMessage] = useState(null)

  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient } }) {
      const { getClientsByUser } = cache.readQuery({ query: GET_CLIENTS_BY_USER });
      cache.writeQuery({
        query: GET_CLIENTS_BY_USER,
        data: { getClientsByUser: [newClient, ...getClientsByUser] }
      })
    }
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      company: '',
      telephone: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('field name is mandatory'),
      surname: Yup.string()
        .required('field surname is mandatory'),
      email: Yup.string()
        .email('the email is invalid')
        .required('field email is mandatory'),
      company: Yup.string()
        .required('field company is mandatory'),
      telephone: Yup.string()
        .required('field phone is mandatory')
    }),
    onSubmit: async values => {
      const { name, surname, email, company, telephone } = values

      try {
        const { data } = await newClient({
          variables: {
            input: {
              name,
              surname,
              email,
              company,
              telephone
            }
          }
        });

        saveMessage(`the user was succesfully created: ${data.newClient.name} `);

        setTimeout(() => {
          saveMessage(null);
          router.push('/')
        }, 3000);

      } catch (error) {
        saveMessage(error.message.replace('GraphQL error: ', ''));

        setTimeout(() => {
          saveMessage(null);
        }, 3000);
      }
    }
  });

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    )
  }

  return (

    <Layout>
      <section className="column justify-center bg-gray-800 w-full pt-5">
        {message && showMessage()}

        <h1 className="text-center text-2xl text-white font-light">Create new Client</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="column bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Client's name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {formik.touched.name && formik.errors.name ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.name}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                  Surname
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="surname"
                  type="text"
                  placeholder="Client's surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.touched.surname && formik.errors.surname ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.surname}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Client's Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.touched.email && formik.errors.email ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                  Company
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="company"
                  type="text"
                  placeholder="Client's company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.touched.company && formik.errors.company ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.company}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                  Telephone
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="telephone"
                  type="text"
                  placeholder="Client's telephone"
                  value={formik.values.telephone}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.touched.telephone && formik.errors.telephone ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.telephone}</p>
                </div>
              ) : null}

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 mb-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
                value="Create Client"
              />
              {message && <img  className="animate-spin w-7 m-auto" src="/favicon.ico" alt="versel logo spiner" />}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default NewClient;