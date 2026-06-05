import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Load initial cart state
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cartItems');
    return localData ? JSON.parse(localData) : [];
  });

  // Load initial user state
  const [userInfo, setUserInfo] = useState(() => {
    const localUser = localStorage.getItem('userInfo');
    return localUser ? JSON.parse(localUser) : null;
  });

  // Load shipping address
  const [shippingAddress, setShippingAddress] = useState(() => {
    const address = localStorage.getItem('shippingAddress');
    return address ? JSON.parse(address) : { address: '', city: '', postalCode: '', country: '' };
  });

  // Persist cart items to localStorage on modification
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist shipping address
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Add to cart action
  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);

      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: Number(qty) } : x
        );
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: Number(qty),
          },
        ];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Authentication actions
  const login = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    // We don't necessarily clear cart on logout, but we can if preferred
  };

  const saveShippingAddress = (addressData) => {
    setShippingAddress(addressData);
  };

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        userInfo,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
        login,
        logout,
        saveShippingAddress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
