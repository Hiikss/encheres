import React, { useEffect, useState } from 'react';
import { RequestUser } from '../../types/User';
import { register } from '../../services/UserService';
import {
    Button,
    Flex,
    Form,
    Input,
    message,
    notification,
    Typography,
} from 'antd';
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
        document.title = 'Inscription';
    }, []);

    const registerFormSubmit = async (values: FieldType) => {
        setFormSubmitted(true);
        const user: RequestUser = {
            pseudo: values.pseudo,
            lastname: values.lastname,
            firstname: values.firstname,
            email: values.email,
            phoneNumber: values.phoneNumber,
            street: values.street,
            postalCode: values.postalCode,
            city: values.city,
            password: values.password,
            credit: 100,
            active: true,
        };

        await register(user)
            .then((res) => {
                setAuthToken(res.data.token);
                auth.setUser(res.data);
                notification.success({
                    message: 'Inscription réussie',
                    description: 'Votre compte a bien été créé',
                    duration: 2,
                });
                navigate('/');
            })
            .catch((err) => {
                setAuthToken(null);
                if (
                    err.response.status === 400 &&
                    (err.response.data.message
                        .toLowerCase()
                        .includes('pseudo') ||
                        err.response.data.message
                            .toLowerCase()
                            .includes('email'))
                ) {
                    messageApi.open({
                        type: 'error',
                        content: `${err.response.data.message.toLowerCase().includes('pseudo') ? 'Ce pseudo' : 'Cet email'} est déjà utilisé`,
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
                            S'inscrire
                        </h3>
                        <hr style={{ color: '#6b7280', width: '110px' }} />
                        <Form layout="vertical" onFinish={registerFormSubmit}>
                            <div className={styles.row}>
                                <Form.Item<FieldType>
                                    label="Pseudo"
                                    name="pseudo"
                                    rules={[
                                        {
                                            pattern: /^[a-zA-Z0-9]{4,}/,
                                            required: true,
                                            message:
                                                'Le pseudo doit avoir minimum 4 caractères et doit contenir uniquement des caractères alphanumériques',
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
                                            type: 'email',
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
                                            pattern: /\b\d{10}\b/g,
                                            max: 10,
                                            required: true,
                                            message:
                                                'Le numéro de téléphone doit contenir 10 chiffres',
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
                                            pattern: /\b\d{5}\b/g,
                                            required: true,
                                            message:
                                                'Le code postal doit contenir 5 chiffres',
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
                                            pattern:
                                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#?!@$%^&*-]{8,}$/,
                                            required: true,
                                            message:
                                                'Le mot de passe doit doit faire au moins 8 caractères et doit contenir au moins une minuscule, une majuscule et un caractère spécial',
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
                                    disabled={formSubmitted}
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
