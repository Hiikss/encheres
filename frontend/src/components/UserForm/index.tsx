import { Button, Form, Input, message, notification, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setRefreshToken, useAuth } from '../AuthProvider';
import { RequestUser, ResponseUser } from '../../types/User';
import { register, updateUser } from '../../services/UserService';
import styles from './UserForm.module.css';

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

const UserForm = ({ type }: { type: 'register' | 'modify' }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const onFormSubmit = async (values: FieldType) => {
        setFormSubmitted(true);
        const user: RequestUser = {
            pseudo: type === 'register' ? values.pseudo.trim() : auth.user.pseudo,
            lastname: values.lastname.trim(),
            firstname: values.firstname.trim(),
            email: values.email.trim(),
            phoneNumber: values.phoneNumber.trim(),
            street: values.street.trim(),
            postalCode: values.postalCode.trim(),
            city: values.city.trim(),
            password: values.password,
            credit: type === 'register' ? 100 : auth.user.credit,
            active: true,
        };

        if (type === 'register') {
            await register(user)
                .then((res) => {
                    setAuthToken(res.data.token, res.data.pseudo);
                    setRefreshToken(res.data.refreshToken)
                    auth.setUser({
                        pseudo: res.data.pseudo,
                        lastname: res.data.lastname,
                        firstname: res.data.firstname,
                        email: res.data.email,
                        phoneNumber: res.data.phoneNumber,
                        street: res.data.street,
                        postalCode: res.data.postalCode,
                        city: res.data.city,
                        credit: res.data.credit,
                        admin: res.data.admin,
                    });
                    notification.success({
                        message: 'Inscription réussie',
                        description: 'Votre compte a bien été créé',
                        duration: 2,
                        placement: 'top',
                    });
                    navigate('/');
                })
                .catch((err) => {
                    setAuthToken(null);
                    setRefreshToken(null);
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
        } else {
            await updateUser(auth.user.pseudo, user)
                .then((res) => {
                    const responseUser: ResponseUser = res.data;
                    auth.setUser({
                        pseudo: responseUser.pseudo,
                        lastname: responseUser.lastname,
                        firstname: responseUser.firstname,
                        email: responseUser.email,
                        phoneNumber: responseUser.phoneNumber,
                        street: responseUser.street,
                        postalCode: responseUser.postalCode,
                        city: responseUser.city,
                        credit: responseUser.credit,
                        admin: auth.user.admin,
                    });
                    notification.success({
                        message: 'Modification réussie',
                        description: 'Votre compte a bien été modifié',
                        duration: 2,
                        placement: 'top',
                    });
                })
                .catch((err) => {
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
                        notification.error({
                            message: 'Une erreur est survenue',
                            duration: 2,
                            placement: 'top',
                        });
                        navigate('/');
                    }
                });
        }
        setFormSubmitted(false);
    };

    return (
        <div className={styles.userForm}>
            {contextHolder}
            <Form layout="vertical" onFinish={onFormSubmit}>
                <div className={styles.formRow}>
                    <Form.Item<FieldType>
                        label="Pseudo"
                        name="pseudo"
                        initialValue={auth.user?.pseudo}
                        rules={[
                            {
                                pattern: /^[a-zA-Z0-9]{4,}$/,
                                required: true,
                                message:
                                    'Le pseudo doit avoir minimum 4 caractères et doit contenir uniquement des caractères alphanumériques',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Pseudo"
                            disabled={type === 'modify'}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        initialValue={auth.user?.email}
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'Veuillez renseigner votre email',
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                </div>
                <div className={styles.formRow}>
                    <Form.Item<FieldType>
                        label="Prénom"
                        name="firstname"
                        initialValue={auth.user?.firstname}
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner votre prénom',
                            },
                        ]}
                    >
                        <Input placeholder="Prénom" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Nom"
                        name="lastname"
                        initialValue={auth.user?.lastname}
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner votre nom',
                            },
                        ]}
                    >
                        <Input placeholder="Nom" />
                    </Form.Item>
                </div>
                <div className={styles.formRow}>
                    <Form.Item<FieldType>
                        label="Téléphone"
                        name="phoneNumber"
                        initialValue={auth.user?.phoneNumber}
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
                        initialValue={auth.user?.street}
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner votre rue',
                            },
                        ]}
                    >
                        <Input placeholder="1 rue de la paix" />
                    </Form.Item>
                </div>
                <div className={styles.formRow}>
                    <Form.Item<FieldType>
                        label="Code postal"
                        name="postalCode"
                        initialValue={auth.user?.postalCode}
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
                        initialValue={auth.user?.city}
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner votre ville',
                            },
                        ]}
                    >
                        <Input placeholder="Paris" />
                    </Form.Item>
                </div>
                <div className={styles.formRow}>
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
                                        getFieldValue('password') === value
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
                        {type === 'register' ? "S'inscrire" : 'Modifier'}
                    </Button>
                </Form.Item>
            </Form>
            {type === 'register' && (
                <div
                    style={{
                        color: '#374151',
                        textAlign: 'center',
                        marginTop: '30px',
                    }}
                >
                    Déjà inscrit ?{' '}
                    <Typography.Link
                        onClick={() => navigate('/login')}
                        style={{ fontWeight: 600 }}
                    >
                        Se connecter
                    </Typography.Link>
                </div>
            )}
        </div>
    );
};

export default UserForm;
