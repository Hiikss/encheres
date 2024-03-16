import React, { useEffect, useState } from 'react';
import { Credentials } from '../../types/User';
import { login } from '../../services/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken, useAuth } from '../AuthProvider';
import {
    Button,
    Checkbox,
    Flex,
    Form,
    Input,
    message,
    notification,
    Typography,
} from 'antd';
import styles from './Login.module.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

type FieldType = {
    login: string;
    password: string;
    remember?: string;
};

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (auth.user) {
            navigate('/');
        }
    });

    useEffect(() => {
        document.title = 'Connexion';
    }, []);

    const loginFormSubmit = async (values: FieldType) => {
        setFormSubmitted(true);
        const credentials: Credentials = {
            login: values.login,
            password: values.password,
        };
        await login(credentials)
            .then((res) => {
                setAuthToken(res.data.token);
                auth.setUser(res.data);
                notification.success({
                    message: 'Connexion réussie',
                    duration: 1,
                });
                navigate('/');
            })
            .catch((err) => {
                setAuthToken(null);
                if (err.response.status === 400) {
                    messageApi.open({
                        type: 'error',
                        content: 'L\'identifiant ou le mot de passe est incorrect',
                    });
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Une erreur est survenue',
                    });
                }
            });
        setFormSubmitted(false);
    };

    return (
        <>
            {contextHolder}
            {!auth.user && (
                <Flex justify="center">
                    <div className={styles.form}>
                        <h3
                            style={{
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '22px',
                            }}
                        >
                            Se connecter
                        </h3>
                        <hr style={{ color: '#6b7280', width: '110px' }} />
                        <Form
                            onFinish={loginFormSubmit}
                            layout="vertical"
                            requiredMark={false}
                        >
                            <Form.Item<FieldType>
                                label="Identifiant"
                                name="login"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Veuillez renseigner votre login',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="Pseudo ou email"
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Mot de passe"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Veuillez renseigner votre mot de passe',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="Mot de passe"
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                name="remember"
                                valuePropName="checked"
                            >
                                <Checkbox>Se souvenir de moi</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={formSubmitted}
                                    block
                                >
                                    Se connecter
                                </Button>
                            </Form.Item>
                        </Form>
                        <div
                            style={{
                                color: '#374151',
                                textAlign: 'center',
                                marginTop: '30px',
                            }}
                        >
                            Pas de compte ?{' '}
                            <Link to="/register" style={{ fontWeight: 600 }}>
                                <Typography.Link>S'inscrire</Typography.Link>
                            </Link>
                        </div>
                    </div>
                </Flex>
            )}
        </>
    );
};

export default Login;
