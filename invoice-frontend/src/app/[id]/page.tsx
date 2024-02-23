"use client"

import ViewInvoice from "@/old_pages/ViewInvoice";
import {Main} from "@/components/App";
import Header from "@/components/menus-toolbars/Header";
import {useLayoutEffect} from "react";
import styles from "../../styles/main.module.css"



const Page = ({params}: { params: { id: string } }) => {

    // todo - read theme from local storage or default to light
    useLayoutEffect(() => {

    });

    return(
<div className={styles.main}>
    <Header />
        <ViewInvoice id={params.id}/>
</div>

    )

}

export default Page;
