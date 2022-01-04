import Layout from '../components/Layout'
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router';

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

export default function Home() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_CLIENTS_BY_USER);

  console.log(data, loading, error);

  if (loading) return <img  className="animate-spin w-7 m-auto" src="/favicon.ico" alt="versel logo spiner" />;

  if (error) return <p>Error :(</p>;
  
  if (!data.getClientsByUser) {
    router.push('/login');
    return <p>Redirecting...</p>
  }

  return (
    <Layout>
      <section className='flex-column pl-4'>
        <h1 className='text-2xl text-gray-800 font-light'>Clients</h1>
        <Link href="/new-client">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">New Client</a>
        </Link>

      
        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Name</th>
              <th className='w-1/5 py-2'>Company</th>
              <th className='w-1/5 py-2'>Email</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data && data.getClientsByUser.map(client => (
              <tr key={client.id}>
                <td className='border px-4 py-2'>{client.name} {client.surname}</td>
                <td className='border px-4 py-2'>{client.company}</td>
                <td className='border px-4 py-2'>{client.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>  
    </Layout>
  )
}
