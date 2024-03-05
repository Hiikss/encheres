import Header from "../Header";
import React from "react";
import {Outlet} from "react-router-dom";

const Layout = () => {

    return (
        <body>
        <Header/>
        <main>
            <Outlet/>
        </main>
        </body>
    );
}

export default Layout;