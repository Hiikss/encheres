import React, { useEffect } from 'react';
import UserForm from '../UserForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import styles from './Register.module.css';
import { Flex } from 'antd';

const Register = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (auth.user) {
            navigate('/');
        }
    });

    useEffect(() => {
        document.title = 'Inscription';
    }, []);

    return (
        <Flex justify="center">
            {!auth.user && (
                <div className={styles.form}>
                    <h3
                        style={{
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '22px',
                        }}
                    >
                        S'inscrire
                    </h3>
                    <hr style={{ color: '#6b7280', width: '110px' }} />
                    <UserForm type="register" />
                </div>
            )}
        </Flex>
    );
};

export default Register;
