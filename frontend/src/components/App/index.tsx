import { Route, Routes } from 'react-router-dom'
import React from 'react'
import Layout from '../Layout'
import Home from '../Home'
import Login from '../Login'
import Register from '../Register'
import Profile from '../Profile'
import AuthenticatedRoute from '../AuthenticatedRoute'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<AuthenticatedRoute />}>
                    <Route path="profile" element={<Profile />}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
