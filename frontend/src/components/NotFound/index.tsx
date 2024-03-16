import { useEffect } from 'react';
import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        document.title = 'Page non trouvée';
    }, []);

    return (
        <Flex
            justify="center"
            align="center"
            vertical
            style={{ marginTop: '200px' }}
        >
            <h2 style={{ fontSize: '30px' }}>Page non trouvée</h2>
            <Link to="/">
                <Typography.Link style={{ fontSize: '16px' }}>Retourner à l'accueil</Typography.Link>
            </Link>
        </Flex>
    );
};

export default NotFound;
