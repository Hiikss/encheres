import { Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResponseUser } from '../../types/User';
import { getUser } from '../../services/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import styles from './Profile.module.css';

const Profile = () => {
    const { pseudo } = useParams();
    const [user, setUser] = useState<ResponseUser>();
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        document.title =
            (auth.user && auth.user.pseudo === pseudo) || !pseudo
                ? 'Mon profil'
                : 'Profil de ' + pseudo;
    }, []);

    useEffect(() => {
        getUser(pseudo ?? auth.user.pseudo)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                navigate('/');
            });
    }, []);

    return (
        <Flex justify="center">
            <div className={styles.profile}>
                <h2 style={{ textAlign: 'center' }}>{(auth.user && auth.user.pseudo === pseudo) || !pseudo
                    ? 'Mon profil'
                    : 'Profil de ' + pseudo}</h2>
                <hr style={{ color: '#6b7280', width: '110px', marginBottom: '30px' }} />
                <div className={styles.row}>
                    <div>Pseudo :</div>
                    <div>{user?.pseudo}</div>
                </div>
                <div className={styles.row}>
                    <div>Email :</div>
                    <div>{user?.email}</div>
                </div>
                <div className={styles.row}>
                    <div>Prénom :</div>
                    <div>{user?.firstname}</div>
                </div>
                <div className={styles.row}>
                    <div>Nom :</div>
                    <div>{user?.lastname}</div>
                </div>
                <div className={styles.row}>
                    <div>Téléphone :</div>
                    <div>{user?.phoneNumber}</div>
                </div>
                <div className={styles.row}>
                    <div>Adresse :</div>
                    <div>
                        {user?.street}, {user?.postalCode} {user?.city}
                    </div>
                </div>
            </div>
        </Flex>
    );
};

export default Profile;
