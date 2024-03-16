import { Button, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResponseUser } from '../../types/User';
import { getUser } from '../../services/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import styles from './Profile.module.css';
import UserForm from '../UserForm';
import { LeftOutlined } from '@ant-design/icons';

const Profile = () => {
    const { pseudo } = useParams();
    const [user, setUser] = useState<ResponseUser>();
    const [modify, setModify] = useState(false);
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
                navigate('*');
            });
    }, [pseudo, auth.user]);

    return (
        <Flex justify="center">
            {modify ? (
                <div className={styles.profileForm}>
                    <Button
                        type="link"
                        onClick={() => setModify(false)}
                        style={{ fontSize: '16px' }}
                    >
                        <LeftOutlined />
                        Retour
                    </Button>
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
                    <UserForm type="modify" />
                </div>
            ) : (
                <div className={styles.profile}>
                    <h3
                        style={{
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '22px',
                        }}
                    >
                        {(auth.user && auth.user.pseudo === pseudo) || !pseudo
                            ? 'Mon profil'
                            : 'Profil de ' + pseudo}{' '}
                    </h3>
                    <hr
                        style={{
                            color: '#6b7280',
                            width: '110px',
                            marginBottom: '30px',
                        }}
                    />
                    <div className={styles.profileRow}>
                        <div>Pseudo :</div>
                        <div>{user?.pseudo}</div>
                    </div>
                    <div className={styles.profileRow}>
                        <div>Email :</div>
                        <div>{user?.email}</div>
                    </div>
                    <div className={styles.profileRow}>
                        <div>Prénom :</div>
                        <div>{user?.firstname}</div>
                    </div>
                    <div className={styles.profileRow}>
                        <div>Nom :</div>
                        <div>{user?.lastname}</div>
                    </div>
                    <div className={styles.profileRow}>
                        <div>Téléphone :</div>
                        <div>{user?.phoneNumber.replace(/(.{2})/g, '$1 ')}</div>
                    </div>
                    <div className={styles.profileRow}>
                        <div>Adresse :</div>
                        <div>
                            {user?.street}, {user?.postalCode} {user?.city}
                        </div>
                    </div>
                    {auth.user.pseudo === user?.pseudo && (
                        <Button
                            onClick={() => setModify(true)}
                            type="primary"
                            size="large"
                            style={{ marginTop: '30px' }}
                            block
                        >
                            Modifier le profil
                        </Button>
                    )}
                </div>
            )}
        </Flex>
    );
};

export default Profile;
