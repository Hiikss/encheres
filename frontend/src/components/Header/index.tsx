import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from 'antd/lib/layout/layout';
import { Drawer, Flex, Menu, MenuProps } from 'antd';
import {
    BookOutlined,
    CloseOutlined,
    EuroCircleOutlined,
    HomeOutlined,
    LoginOutlined,
    LogoutOutlined,
    MenuOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import styles from './Header.module.css';
import { useAuth } from '../AuthProvider';
import { MixerVerticalIcon } from '@radix-ui/react-icons';

const AppMenu = ({
    isInline = false,
    current,
    setCurrent,
    setOpenMenu,
}: {
    isInline?: boolean;
    current: string;
    setCurrent: React.Dispatch<React.SetStateAction<string>>;
    setOpenMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const auth = useAuth();

    const notLoggedInItems: MenuProps['items'] = [
        {
            label: <Link to="/">Accueil</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to="/login">Se connecter</Link>,
            key: '/login',
            icon: <LoginOutlined />,
        },
        {
            label: <Link to="/register">S'inscrire</Link>,
            key: '/register',
            icon: <UserAddOutlined />,
        },
    ];

    const loggedInItems: MenuProps['items'] = [
        {
            label: <Link to="/">Accueil</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to="/sell">Vendre un article</Link>,
            key: '/sell',
            icon: <EuroCircleOutlined />,
        },
        {
            label: <Link to="/profile">Profil</Link>,
            key: '/profile',
            icon: <UserOutlined />,
        },
        {
            label: 'Déconnexion',
            key: '/logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => auth.logOut(),
        },
    ];

    if (auth.user?.admin) {
        loggedInItems.splice(loggedInItems.length - 1, 0, {
            label: 'Admin',
            key: '/admin',
            icon: <MixerVerticalIcon />,
            children: [
                {
                    label: <Link to="/admin/users">Utilisateurs</Link>,
                    key: '/admin/users',
                    icon: <TeamOutlined />,
                },
                {
                    label: <Link to="/admin/categories">Catégories</Link>,
                    key: '/admin/categories',
                    icon: <BookOutlined />,
                },
            ],
        });
    }

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={(e) => {
                onClick(e);
                setOpenMenu !== undefined && setOpenMenu(false);
            }}
            selectedKeys={[current]}
            mode={isInline ? 'inline' : 'horizontal'}
            items={auth.user ? loggedInItems : notLoggedInItems}
            style={{ border: 'none' }}
        />
    );
};

const AppHeader = () => {
    const location = useLocation();
    const [current, setCurrent] = useState<string>(location.pathname);
    const [openMenu, setOpenMenu] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        if (location.pathname === `/profile/${auth.user?.pseudo}`) {
            setCurrent('/profile');
        } else {
            setCurrent(location.pathname);
        }
    }, [location]);

    return (
        <Header
            style={{
                background: 'white',
                boxShadow:
                    '0 1px 2px 0 rgba(0, 0, 0, 0.03),0 1px 6px -1px rgba(0, 0, 0, 0.02),0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                zIndex: '1',
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                style={{ height: '100%' }}
            >
                <h1>
                    <Link to="/" style={{ color: '#0e7490' }}>
                        ENI-Enchères
                    </Link>
                </h1>
                <div className={styles.headerMenu}>
                    <AppMenu current={current} setCurrent={setCurrent} />
                </div>
                <MenuOutlined
                    className={styles.drawerMenu}
                    onClick={() => setOpenMenu(true)}
                    style={{ color: '#0e7490', fontSize: 30 }}
                />
            </Flex>
            <Drawer
                size="large"
                className={styles.drawerMenu}
                placement="left"
                open={openMenu}
                onClose={() => setOpenMenu(false)}
                closable={false}
            >
                <div
                    style={{
                        height: '64px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <CloseOutlined
                        onClick={() => setOpenMenu(false)}
                        style={{ color: '#0e7490', fontSize: 30 }}
                    />
                </div>
                <AppMenu
                    current={current}
                    setCurrent={setCurrent}
                    setOpenMenu={setOpenMenu}
                    isInline
                />
            </Drawer>
        </Header>
    );
};

export default AppHeader;
