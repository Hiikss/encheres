import React, {useEffect} from "react";

const Register = () => {

    useEffect(() => {
        document.title = 'Inscription';
    }, []);

    return (
        <div>
            S'inscrire
            <form>
                <label>
                    Pseudo :{" "}
                    <input type="text"/>
                </label>
                <label>
                    Mot de passe :{" "}
                    <input type="password"/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

export default Register;