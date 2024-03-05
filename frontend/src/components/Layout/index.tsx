import Header from "../Header";
import React from "react";
import {BrowserRouter} from "react-router-dom";

interface Props {
    children: React.ReactNode
}

const Layout = (props: Props) => {

    return (
        <BrowserRouter>
            <body>
            <Header/>
            <main>
                {props.children}
            </main>
            </body>
        </BrowserRouter>
    );
}

export default Layout;