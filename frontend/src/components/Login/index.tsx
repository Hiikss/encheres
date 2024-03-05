import React, {useEffect} from "react";
import {Credentials} from "../../types/User";
import {login} from "../../services/UserService";
import header from "../Header";

const Login = () => {

    useEffect(() => {
        document.title = 'Connexion';
    }, []);

    const loginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const credentials: Credentials = {
            login: e.currentTarget.login.value,
            password: e.currentTarget.password.value
        };
        try {
            const res = await login(credentials);
            console.log(res.status);
        } catch (err) {
            console.log("error occured while logging")
        }
    }

    return (
        <div>
            Se connecter
            <form onSubmit={loginFormSubmit}>
                <div>
                    <label>
                        Identifiant :{" "}
                        <input type="text" name="login"/>
                    </label>
                </div>
                <div>
                    <label>
                        Mot de passe :{" "}
                        <input type="password" name="password"/>
                    </label>
                </div>
                <input type="submit"/>
            </form>
        </div>
    );
}

export default Login;