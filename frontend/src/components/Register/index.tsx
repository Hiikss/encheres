import React, { useEffect, useState } from 'react'
import { RequestUser } from '../../types/User'
import { register } from '../../services/UserService'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../AuthProvider'

const Register = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Inscription'
    }, [])

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value)
    }

    const handleConfirmPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(event.target.value)
    }

    const registerFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            message.error('Les mots de passe ne correspondent pas')
            return
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
        }

        await register(user)
            .then((res) => {
                setAuthToken(res.data.token)
                navigate('/')
            })
            .catch((err) => {
                setAuthToken(null)
            })
    }

    return (
        <div>
            S'inscrire
            <form onSubmit={registerFormSubmit}>
                <div>
                    <label>
                        Pseudo : <input type="text" name="pseudo" />
                    </label>
                </div>
                <div>
                    <label>
                        Email : <input type="email" name="email" />
                    </label>
                </div>
                <div>
                    <label>
                        Prénom : <input type="text" name="firstname" />
                    </label>
                </div>
                <div>
                    <label>
                        Nom : <input type="text" name="lastname" />
                    </label>
                </div>
                <div>
                    <label>
                        Téléphone : <input type="text" name="phoneNumber" />
                    </label>
                </div>
                <div>
                    <label>
                        Rue : <input type="text" name="street" />
                    </label>
                </div>
                <div>
                    <label>
                        Code postal : <input type="text" name="postalCode" />
                    </label>
                </div>
                <div>
                    <label>
                        Ville : <input type="text" name="city" />
                    </label>
                </div>
                <div>
                    <label>
                        Mot de passe :{' '}
                        <input
                            type="password"
                            value={password}
                            name="password"
                            onChange={handlePasswordChange}
                        />
                        {/*"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"*/}
                    </label>
                </div>
                <div>
                    <label>
                        Confirmation :{' '}
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </label>
                </div>
                <input type="submit" />
            </form>
        </div>
    )
}

export default Register
