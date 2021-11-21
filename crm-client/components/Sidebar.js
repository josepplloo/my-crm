import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PATH } from '../constants/routes'

const Sidebar = () => {
  const router = useRouter();

  if (router.pathname === PATH.LOGIN || router.pathname === PATH.NEW) {
    return null;
  }


  return (
    <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p5">
      <div>
        <p className="text-white">CRM Client</p>
      </div>
      <nav className="mt-5">
        <ol className="text-white">
          <li className={router.pathname === '/' ? 'bg-blue-800 p-3' : 'p-3' }>
            <Link href="/"><a className="block">Home</a></Link>
          </li>
          <li className={router.pathname === '/orders' ? 'bg-blue-800 p-3' : 'p-3' }>
            <Link href="/orders"><a className="block">Orders</a></Link>
          </li>
          <li className={router.pathname === '/products' ? 'bg-blue-800 p-3' : 'p-3' }>
            <Link href="/products"><a className="block">Products</a></Link>
          </li>
        </ol>
      </nav>
    </aside>
  )
}

export default Sidebar;
