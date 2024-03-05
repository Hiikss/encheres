import React, {useEffect} from 'react';
import Layout from "../Layout";

const Home = () => {

    useEffect(() => {
        document.title = 'Accueil';
    }, []);

    return (
        <body>
        <Layout>
            Hello world
        </Layout>
        </body>
    );
}

export default Home;
