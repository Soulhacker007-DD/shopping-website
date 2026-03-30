'use client'
import React from 'react'
import AdminDashbordLayout from './AdminDashboardLayout'
import useGetCurrentUser from '@/hooks/useGetCurrentUser'




function AdminDashboard() {
  useGetCurrentUser()
  return (
    <div className='w-full min-h-screen pt-15'>
    
      <AdminDashbordLayout/>
    </div>
  )
}

export default AdminDashboard
