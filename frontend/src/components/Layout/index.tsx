import AppHeader from "../Header";
import React from "react";
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import {Content} from "antd/lib/layout/layout";

const AppLayout = () => {

    return (
        <Layout>
            <AppHeader/>
            <Content>
                <Outlet/>
            </Content>
        </Layout>
    );
}

export default AppLayout;