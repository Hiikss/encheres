import { Button, Flex, Modal, ModalFuncProps, notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { PartialUserRequest, ResponseUser } from '../../types/User';
import { getUser, updatePartiallyUser } from '../../services/UserService';
import { useParams } from 'react-router-dom';
import { getPseudo, useAuth } from '../AuthProvider';
import styles from './Profile.module.css';
import UserForm from '../UserForm';
import { ExclamationCircleFilled, LeftOutlined } from '@ant-design/icons';
import NotFound from '../NotFound';

const Profile = () => {
    const { pseudo } = useParams();
    const [user, setUser] = useState<ResponseUser>();
    const [modify, setModify] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const auth = useAuth();

    const onModalOk = async () => {
        if (auth.user) {
            const userToDisable: PartialUserRequest = {
                pseudo: auth.user.pseudo,
                active: false,
            };
            await updatePartiallyUser(userToDisable)
                .then((res) => {
                    notification.success({
                        message: 'Votre compte a bien été désactivé',
                        description: "Vous avez été redirigé vers l'accueil",
                        duration: 2,
                        placement: 'top',
                    });
                    auth.logOut();
                })
                .catch((err) => {
                    notification.error({
                        message: 'Une erreur est survenue',
                        duration: 2,
                        placement: 'top',
                    });
                });
        }
    };

    const deleteAccountModal: ModalFuncProps = {
        title: 'Voulez-vous vraiment désactiver votre compte ?',
        icon: <ExclamationCircleFilled />,
        okText: 'Confirmer',
        okButtonProps: {
            danger: true,
        },
        onOk: onModalOk,
        cancelText: 'Annuler',
        content: (
            <div style={{ fontSize: '16px', marginBottom: '20px' }}>
                Cela supprimera vos ventes et vos enchères
            </div>
        ),
    };

    useEffect(() => {
        document.title =
            (auth.user && auth.user.pseudo === pseudo) || !pseudo
                ? 'Mon profil'
                : 'Profil de ' + pseudo;
    }, []);

    useEffect(() => {
        getUser(pseudo ?? getPseudo())
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [pseudo]);

    if (loading) {
        return (
            <Flex
                justify="center"
                align="center"
                style={{ marginTop: '200px' }}
            >
                <Spin size="large" />
            </Flex>
        );
    } else if (!user?.active || error) {
        return <NotFound />;
    }
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
                        Modifier le profil
                    </h3>
                    <hr style={{ color: '#6b7280', width: '110px' }} />
                    <UserForm type="modify" />
                    <Button
                        onClick={async () =>
                            await modal.confirm(deleteAccountModal)
                        }
                        size="large"
                        style={{ marginTop: '10px' }}
                        block
                        danger
                    >
                        Désactiver le compte
                    </Button>
                    {contextHolder}
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
                        <div className={styles.profileRow}>
                            <div>Crédit :</div>
                            <div>{user?.credit}</div>
                        </div>
                    )}
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
