import { Route, Routes } from 'react-router-dom';
import React from 'react';
import Layout from '../Layout';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import Profile from '../Profile';
import AuthenticatedRoute from '../AuthenticatedRoute';
import Sell from '../Sell';
import NotFound from '../NotFound';
import SoldItem from '../SoldItem';
import AdminRoute from '../AdminRoute';
import AdminUsers from '../Admin/Users';
import AdminCategories from '../Admin/Categories';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="*" element={<NotFound />} />
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<AuthenticatedRoute />}>
                    <Route path="profile/:pseudo" element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="sell" element={<Sell />} />
                    <Route path="solditem/:soldItemId" element={<SoldItem />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path="admin/users" element={<AdminUsers />} />
                    <Route path="admin/categories" element={<AdminCategories />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
