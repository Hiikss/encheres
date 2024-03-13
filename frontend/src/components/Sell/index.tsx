import React, { useContext, useEffect } from 'react'
import { useAuth } from '../AuthProvider'


const Sell = () => {
    const auth = useAuth();

    useEffect(() => {
        document.title = 'Vendre un article';
    }, []);

    return (
        <div>
            Vendre un article
            Hello {auth.user?.pseudo}
        </div>
    );
}

export default Sell;