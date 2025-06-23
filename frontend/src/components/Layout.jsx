import {} from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
   <div className="margin-0 p-0 w-full h-screen font-roboto">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <main className="flex items-center justify-center w-full bg-[linear-gradient(90deg,_rgba(33,115,115,0.5)_23%,_rgba(83,145,77,0.5)_60%,_rgba(132,176,38,0.5)_100%)]">
          <Outlet />
        </main>
      </div>
    </div>
    )
}