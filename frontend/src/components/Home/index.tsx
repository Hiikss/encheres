import React, {useEffect} from 'react';
import {Button} from "antd";

const Home = () => {

    useEffect(() => {
        document.title = 'Accueil';
    }, []);

    return (
        <div>
            Hello world
            <Button type="primary">Hello</Button>
        </div>
    );
}

export default Home;
