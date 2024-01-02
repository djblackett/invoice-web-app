"use client"
import { Metadata } from "next";
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import Providers from "@/app/providers";
import "../styles/css-vars.css"
import "../styles/index.css"

// export const metadata: Metadata = {
//   title: {
//     default: "Next.js App Router",
//     template: "%s | Next.js App Router",
//   },
//   description:
//     "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
//   openGraph: {
//     title: "Next.js App Router Playground",
//     description:
//       "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
//   },
// };

const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: var(--colors-body);
  transition: all 0.4s ease-in-out;
  z-index: 1;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }

  // applies the appropriate theme to each status type
  .draft {
    background: var(--colors-draft-background);
    color: var(--colors-draft-text);

    .circle {
      background: var(--colors-draft-text);
    }
  }

  .pending {
    background-color: rgba(255, 143, 0, 0.06);
    color: rgb(255, 143, 0);

    .circle {
      background: rgb(255, 143, 0);
    }
  }

  .paid {
    background-color: rgba(51, 214, 159, 0.06);
    color: #33d69f;

    .circle {
      background: #33d69f;
    }
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    return (
    <html lang="en" suppressHydrationWarning>
      <body>
      {/*<Main>*/}
      {/*    /!*  @ts-ignore *!/*/}
      {/*    <Header />*/}
      <Providers>
        {children}
      </Providers>
      {/*</Main>*/}
      </body>
    </html>
  );
}
