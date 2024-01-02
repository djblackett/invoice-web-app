// app/providers.jsx

'use client'

import {ThemeProvider} from 'next-themes'
import React, {useState} from "react";
import client from "@/graphql/apollo-client";
import {Provider} from "react-redux";
import store from "@/features/store";
import App from "@/components/App";
import {ApolloProvider} from "@apollo/client";
import {ThemeProvider as StyleProvider} from "styled-components";
import {darkTheme, lightTheme} from "@/styles/Themes";
import StyledComponentsRegistry from "../../registry";

function Providers({children}: {children: React.ReactNode}) {
    const [theme, setTheme] = useState("light");
    return (
        <StyledComponentsRegistry>
    <ApolloProvider client={client}>
        <React.StrictMode>
            <Provider store={store}>
                {/*<StyleProvider theme={theme === "light" ? lightTheme : darkTheme}>*/}
                    {children}
                {/*</StyleProvider>*/}
                {/*<ThemeProvider>{children}</ThemeProvider>*/}
            </Provider>
        </React.StrictMode>
    </ApolloProvider>
         </StyledComponentsRegistry>
    )
}

export default Providers;