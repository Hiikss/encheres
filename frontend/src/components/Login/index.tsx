import React, { useEffect, useState } from 'react'
import { Credentials } from '../../types/User'
import { login } from '../../services/UserService'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken, useAuth } from '../AuthProvider'
import {
    Button,
    Checkbox,
    Col,
    Flex,
    Form,
    Input,
    message,
    Row,
    Tag, Typography,
} from 'antd'
import './index.css'
import { InfoCircleOutlined } from '@ant-design/icons'

type FieldType = {
    login: string
    password: string
    remember?: string
}

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
        if (auth.user) {
            navigate('/')
        }
    })

    useEffect(() => {
        document.title = 'Connexion'
    }, [])

    const loginFormSubmit = async (values: FieldType) => {
        const credentials: Credentials = {
            login: values.login,
            password: values.password,
        }
        await login(credentials)
            .then((res) => {
                setAuthToken(res.data.token)
                auth.setUser(res.data)
                navigate('/')
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    messageApi.open({
                        type: 'error',
                        content: 'Identifiant ou mot de passe incorrect',
                    })
                }
                setAuthToken(null)
            })
    }

    return (
        <>
            {contextHolder}
            {!auth.user && (
                <Flex justify="center">
                    <div className="form">
                        <h3
                            style={{
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '22px',
                            }}
                        >
                            Se connecter
                        </h3>
                        <hr style={{ color: '#6b7280', width: '30%' }} />
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
                                <Input placeholder="Pseudo ou email" />
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
                                <Input.Password placeholder="Mot de passe" />
                            </Form.Item>
                            <Form.Item<FieldType>
                                name="remember"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    Se souvenir de moi
                                </Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
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
                            </Link>{' '}
                            dès maintenant
                        </div>
                    </div>
                </Flex>
            )}
        </>
    )
}

export default Login
