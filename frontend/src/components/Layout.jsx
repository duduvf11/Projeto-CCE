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
        <main className="flex items-center justify-center w-full bg-[#f0f0f0]">
          <Outlet />
        </main>
      </div>
    </div>
    )
}