import React, { useEffect } from 'react'
import { Credentials } from '../../types/User'
import { login } from '../../services/UserService'
import { setAuthHeader } from '../../services/AxiosInstance'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Connexion'
    }, [])

    const loginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const credentials: Credentials = {
            login: e.currentTarget.login.value,
            password: e.currentTarget.password.value,
        }
        await login(credentials)
            .then((res) => {
                setAuthHeader(res.data.token)
                navigate('/')
            })
            .catch((err) => {
                setAuthHeader(null)
            })
    }

    return (
        <div>
            Se connecter
            <form onSubmit={loginFormSubmit}>
                <div>
                    <label>
                        Identifiant : <input type="text" name="login" />
                    </label>
                </div>
                <div>
                    <label>
                        Mot de passe : <input type="password" name="password" />
                    </label>
                </div>
                <input type="submit" />
            </form>
        </div>
    )
}

export default Login
