"use client"

import ViewInvoice from "@/old_pages/ViewInvoice";
import {Main} from "@/components/App";
import Header from "@/components/menus-toolbars/Header";
import {useLayoutEffect} from "react";



const Page = ({params}: { params: { id: string } }) => {
    console.log("slug:", params.id)
    console.log(typeof params.id)
    // const theme =
    useLayoutEffect(() => {

    })

    return(
<Main>
    <Header />
        <ViewInvoice id={params.id}/>
</Main>

    )

}

export default Page;
