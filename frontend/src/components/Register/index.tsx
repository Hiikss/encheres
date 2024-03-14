import React, { useEffect, useState } from 'react';
import { RequestUser } from '../../types/User';
import { register } from '../../services/UserService';
import { Button, Flex, Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken, useAuth } from '../AuthProvider';
import styles from './Register.module.css';

type FieldType = {
    pseudo: string;
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    street: string;
    postalCode: string;
    city: string;
    password: string;
    confirm: string;
};

const Register = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
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

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(event.target.value);
    };

    const registerFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            message.error('Les mots de passe ne correspondent pas');
            return;
        }

        const user: RequestUser = {
            pseudo: e.currentTarget.pseudo.value,
            lastname: e.currentTarget.lastname.value,
            firstname: e.currentTarget.firstname.value,
            email: e.currentTarget.email.value,
            phoneNumber: e.currentTarget.phoneNumber.value,
            street: e.currentTarget.street.value,
            postalCode: e.currentTarget.postalCode.value,
            city: e.currentTarget.city.value,
            password: e.currentTarget.password.value,
            credit: 100,
            active: true,
        };

        await register(user)
            .then((res) => {
                setAuthToken(res.data.token);
                auth.setUser(res.data);
                navigate('/');
            })
            .catch((err) => {
                setAuthToken(null);
                if (err.response.status === 400) {
                    messageApi.open({
                        type: 'error',
                        content: 'Identifiant ou mot de passe incorrect',
                    });
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Une erreur est survenue',
                    });
                }
            });
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
                            S'inscrire
                        </h3>
                        <hr style={{ color: '#6b7280', width: '110px' }} />
                        <Form layout="vertical">
                            <div className={styles.row}>
                                <Form.Item<FieldType>
                                    label="Pseudo"
                                    name="pseudo"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre pseudo',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Pseudo" />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre email',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                            </div>
                            <div className={styles.row}>
                                <Form.Item<FieldType>
                                    label="Prénom"
                                    name="firstname"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre prénom',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Prénom" />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Nom"
                                    name="lastname"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre nom',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nom" />
                                </Form.Item>
                            </div>
                            <div className={styles.row}>
                                <Form.Item<FieldType>
                                    label="Téléphone"
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre numéro de téléphone',
                                        },
                                    ]}
                                >
                                    <Input placeholder="0605040302" />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Rue"
                                    name="street"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre rue',
                                        },
                                    ]}
                                >
                                    <Input placeholder="1 rue de la paix" />
                                </Form.Item>
                            </div>
                            <div className={styles.row}>
                                <Form.Item<FieldType>
                                    label="Code postal"
                                    name="postalCode"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre code postal',
                                        },
                                    ]}
                                >
                                    <Input placeholder="75000" />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Ville"
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez renseigner votre ville',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Paris" />
                                </Form.Item>
                            </div>
                            <div className={styles.row}>
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
                                    <Input.Password placeholder="Mot de passe" />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Confirmation mot de passe"
                                    name="confirm"
                                    dependencies={['password']}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Veuillez confirmer votre mot de passe',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        'password'
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        'Les mots de passe ne correspondent pas'
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Mot de passe" />
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{ marginTop: '20px' }}
                                    block
                                >
                                    S'inscrire
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
                            Déjà inscrit ?{' '}
                            <Link to="/login" style={{ fontWeight: 600 }}>
                                <Typography.Link>Se connecter</Typography.Link>
                            </Link>
                        </div>
                    </div>
                </Flex>
            )}
        </>
    );
};

export default Register;
