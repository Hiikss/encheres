import React, {useEffect} from 'react';

const Home = () => {

    useEffect(() => {
        document.title = 'Accueil';
    }, []);

    return (
        <div>
            Hello world
        </div>
    );
}

export default Home;
