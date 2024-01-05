"use client"

import React, {useLayoutEffect} from "react";
import Providers from "@/app/providers";
import "../styles/css-vars.css"
import "../styles/index.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


    return (
    <html lang="en">
      <body>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}