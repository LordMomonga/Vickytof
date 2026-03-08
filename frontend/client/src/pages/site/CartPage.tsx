import { Button } from "@mui/material";
import { useMemo } from "react";
import { useCartStore } from "../../store/cart.store";

export const CartPage = () => {
  const { items, increment, decrement, removeItem, clear } = useCartStore();
  const total = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.product.price, 0), [items]);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-4xl font-bold">Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.product.id} className="grid grid-cols-[90px_1fr_auto] items-center gap-4 rounded-xl border border-slate-300 bg-white p-3">
              <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded object-cover" />
              <div>
                <p className="text-xl font-semibold">{item.product.name}</p>
                <p>${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => decrement(item.product.id)} variant="outlined">-</Button>
                <span>{item.quantity}</span>
                <Button onClick={() => increment(item.product.id)} variant="outlined">+</Button>
                <Button color="error" onClick={() => removeItem(item.product.id)}>Remove</Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-4">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
            <div className="flex gap-2">
              <Button variant="outlined" onClick={clear}>Clear</Button>
              <Button variant="contained" sx={{ bgcolor: "#000", '&:hover': { bgcolor: '#111' } }}>Checkout</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
