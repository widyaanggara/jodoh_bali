"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { INITIAL_PRODUCT_STATE, reduceProductState, type ProductAction, type ProductState } from "@/lib/netra-hasta/product-flow";

const ProductContext = createContext<{ state: ProductState; dispatch: Dispatch<ProductAction> } | null>(null);

export default function NetraHastaProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceProductState, INITIAL_PRODUCT_STATE);
  useEffect(() => {
    const clear = () => dispatch({ type: "reset" });
    const visibility = () => { if (document.hidden) clear(); };
    window.addEventListener("pagehide", clear);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pagehide", clear);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>;
}

export function useNetraHastaProduct() {
  const value = useContext(ProductContext);
  if (!value) throw new Error("Netra Hasta product context tidak tersedia.");
  return value;
}
