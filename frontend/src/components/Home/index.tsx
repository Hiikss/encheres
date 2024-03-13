import React, { useEffect } from 'react'
import { Button } from 'antd'
import { useAuth } from '../AuthProvider'

const Home = () => {
    const auth = useAuth()

    useEffect(() => {
        document.title = 'Accueil'
    }, [])

    return (
        <div>
            Hello {auth.user?.pseudo}
            <Button type="primary">Hello</Button>
        </div>
    )
}

export default Home;
