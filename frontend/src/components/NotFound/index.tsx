import { useEffect } from 'react';
import { Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

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
            <Typography.Link
                onClick={() => navigate('/')}
                style={{ fontSize: '16px' }}
            >
                Retourner à l'accueil
            </Typography.Link>
        </Flex>
    );
};

export default NotFound;
