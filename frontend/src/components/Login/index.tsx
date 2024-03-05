import React, {useEffect} from "react";

const Login = () => {

    useEffect(() => {
        document.title = 'Connexion';
    }, []);

    return (
        <div>
            Se connecter
            <form>
                <label>
                    Identifiant :{" "}
                    <input type="text" />
                </label>
                <label>
                    Mot de passe :{" "}
                    <input type="password" />
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

export default Login;