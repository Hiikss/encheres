import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Header} from "antd/lib/layout/layout";
import {Flex, Menu, MenuProps} from "antd";

const items: MenuProps['items'] = [
    {
        label: <Link to="/">Accueil</Link>,
        key: 'home',
    },
    {
        label: <Link to="/login">Se connecter</Link>,
        key: 'login',
    },
    {
        label: <Link to="/register">S'inscrire</Link>,
        key: 'register',

    },
];

const AppHeader = () => {
    const [current, setCurrent] = useState('home');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        <Header style={{background: "white", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)"}}>
            <Flex justify="space-between" align="center" style={{height: '100%'}}>
                <h1>
                    <Link to="/" style={{color:"#0e7490"}} onClick={()=>setCurrent("home")}>ENI-Enchères</Link>
                </h1>
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
            </Flex>
        </Header>
    )
}

export default AppHeader;