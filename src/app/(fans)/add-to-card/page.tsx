import CheckoutPage from '@/components/ui/fans/checkout'
import { myFetch } from '../../../../helpers/myFetch'
import React from 'react'

const page = async () => {
  const [cartRes] = await Promise.all([
    myFetch('/cart', { tags: ['cart'] })
  ])
  const cartItems = cartRes?.data?.cart || []
  const priceBreakdown = cartRes?.data?.price_breakdown || {}
  return (
    <div><CheckoutPage cartItems={cartItems} priceBreakdown={priceBreakdown} /></div>
  )
}

export default page