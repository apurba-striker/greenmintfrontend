import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import './CartIcon.css';

const CartIcon = () => {
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <>
      <button 
        className="cart-icon-btn"
        onClick={() => setIsCartOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {itemCount > 0 && (
          <span className="cart-count">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default CartIcon;
