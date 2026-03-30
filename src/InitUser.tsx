'use client'
import React from 'react'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import useGetAllProductsData from './hooks/useGetAllProductsData'
import useGetAllVendorData from './hooks/useGetAllVendorData'
import useGetAllOrderData from './hooks/useGetAllOrderData'


function InitUser() {
  useGetCurrentUser()
  useGetAllProductsData()
  useGetAllVendorData()
  useGetAllOrderData()
  return null
}

export default InitUser
