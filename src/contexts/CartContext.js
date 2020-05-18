import React, { createContext, useReducer, useEffect } from "react"
import Client from "shopify-buy"

import { cartReducer } from "../reducers/CartReducer"

const SHOPIFY_CHECKOUT_STORAGE_KEY = "shopify_checkout_id"

const client = Client.buildClient({
  storefrontAccessToken: process.env.SHOP_TOKEN,
  domain: `${process.env.SHOP_NAME}.myshopify.com`,
})

const initialCartState = {
  client,
  isAdding: false,
  checkout: { lineItems: [] },
}

const CartContext = createContext({
  cart: initialCartState,
  setCart: () => null,
})

const CartContextProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState, () => {
    const localData = localStorage.getItem(SHOPIFY_CHECKOUT_STORAGE_KEY)
    return localData ? JSON.parse(localData) : initialCartState
  })

  useEffect(() => {
    localStorage.setItem(SHOPIFY_CHECKOUT_STORAGE_KEY, JSON.stringify(cart))
  }, cart)

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext, CartContextProvider }
