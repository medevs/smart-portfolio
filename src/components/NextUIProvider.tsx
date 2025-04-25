"use client";

import { NextUIProvider as UIProvider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export function NextUIProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <UIProvider>
      {children}
    </UIProvider>
  );
}
