import { Button, Flex, Modal, ModalFuncProps, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResponseUser } from '../../types/User';
import { deleteUser, getUser } from '../../services/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { setAuthToken, useAuth } from '../AuthProvider';
import styles from './Profile.module.css';
import UserForm from '../UserForm';
import { ExclamationCircleFilled, LeftOutlined } from '@ant-design/icons';

const Profile = () => {
    const { pseudo } = useParams();
    const [user, setUser] = useState<ResponseUser>();
    const [modify, setModify] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate();
    const auth = useAuth();

    const onModalOk = async () => {
        if (auth.user.pseudo) {
            await deleteUser(auth.user.pseudo).then((res) => {
                notification.success({
                    message: 'Votre compte a bien été supprimé',
                    description: "Vous avez été redirigé vers l'accueil",
                    duration: 2,
                    placement: 'top',
                });
                auth.setUser(null);
                setAuthToken(null);
                navigate('/');
            }).catch((err) => {
                notification.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
        }
    };

    const deleteAccountModal: ModalFuncProps = {
        title: 'Voulez-vous vraiment supprimer votre compte ?',
        icon: <ExclamationCircleFilled />,
        okText: 'Confirmer',
        okButtonProps: {
            danger: true,
        },
        onOk: onModalOk,
        cancelText: 'Annuler',
        content: (
            <div style={{ fontSize: '16px', marginBottom: '20px' }}>
                Attention, cette action est irréversible
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
                        Supprimer le compte
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
