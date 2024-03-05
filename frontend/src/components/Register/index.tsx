import React, {useEffect} from "react";
import {SignUp} from "../../types/User";
import {register} from "../../services/UserService";

const registerFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: SignUp = {
        pseudo: e.currentTarget.pseudo.value,
        lastname: e.currentTarget.lastname.value,
        firstname: e.currentTarget.firstname.value,
        email: e.currentTarget.email.value,
        phoneNumber: e.currentTarget.phoneNumber.value,
        street: e.currentTarget.street.value,
        postalCode: e.currentTarget.postalCode.value,
        city: e.currentTarget.city.value,
        password: e.currentTarget.password.value,
    };
    try {
        const res = await register(user);
        console.log(res.status);
    } catch (err) {
        console.log("error occured while register")
    }
}

const Register = () => {

    useEffect(() => {
        document.title = 'Inscription';
    }, []);

    return (
        <div>
            S'inscrire
            <form onSubmit={registerFormSubmit}>
                <div>
                    <label>
                        Pseudo :{" "}
                        <input type="text" name="pseudo"/>
                    </label>
                </div>
                <div>
                    <label>
                        Email :{" "}
                        <input type="text" name="email"/>
                    </label>
                </div>
                <div>
                    <label>
                        Prénom :{" "}
                        <input type="text" name="firstname"/>
                    </label>
                </div>
                <div>
                    <label>
                        Nom :{" "}
                        <input type="text" name="lastname"/>
                    </label>
                </div>
                <div>
                    <label>
                        Téléphone :{" "}
                        <input type="text" name="phoneNumber"/>
                    </label>
                </div>
                <div>
                    <label>
                        Rue :{" "}
                        <input type="text" name="street"/>
                    </label>
                </div>
                <div>
                    <label>
                        Code postal :{" "}
                        <input type="text" name="postalCode"/>
                    </label>
                </div>
                <div>
                    <label>
                        Ville :{" "}
                        <input type="text" name="city"/>
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

export default Register;