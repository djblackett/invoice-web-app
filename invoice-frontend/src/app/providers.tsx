'use client'

import React, {useLayoutEffect, useState} from "react";
import client from "@/graphql/apollo-client";
import {Provider} from "react-redux";
import store from "@/features/store";
import {ApolloProvider} from "@apollo/client";
import StyledComponentsRegistry from "../../registry";

// todo - Fix up the style providers after finalizing which style system to use

function Providers({children}: {children: React.ReactNode}) {
    const [theme, setTheme] = useState("light");
    useLayoutEffect(() => {
        if (localStorage.getItem("theme") !== null) {
            document.body.dataset.theme = localStorage.getItem("theme") as string;
        } else if (localStorage.getItem("theme")) {
            document.body.dataset.theme = "light";
            localStorage.setItem("theme", "light");
        }
    }, []);

    return (
    <ApolloProvider client={client}>
        <React.StrictMode>
            <Provider store={store}>
                {/*<StyledComponentsRegistry>*/}
                {/*<StyleProvider theme={theme === "light" ? lightTheme : darkTheme}>*/}
                    {children}
                {/*</StyleProvider>*/}
                {/*<ThemeProvider>{children}</ThemeProvider>*/}
                {/*</StyledComponentsRegistry>*/}
            </Provider>
        </React.StrictMode>
    </ApolloProvider>

    )
}

export default Providers;