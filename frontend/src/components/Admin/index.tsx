import React, { useEffect, useState } from 'react';
import { RequestUser, ResponseUser } from '../../types/User';
import { deleteUser, getUsers, updateUser } from '../../services/UserService';
import {
    Button,
    Input,
    message,
    Modal,
    notification,
    Space,
    Table,
} from 'antd';
import styles from './Admin.module.css';
import { ExclamationCircleFilled } from '@ant-design/icons';

const Admin = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [modal, modalContextHolder] = Modal.useModal();
    const [users, setUsers] = useState<ResponseUser[]>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState(0);

    const updateActiveUser = async (user: ResponseUser, active: boolean) => {
        const userToUpdate: RequestUser = {
            pseudo: user.pseudo,
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            street: user.street,
            postalCode: user.postalCode,
            city: user.city,
            password: '',
            credit: user.credit,
            active: active,
        };
        await updateUser(user.pseudo, userToUpdate)
            .then((res) => {
                notification.success({
                    message: `L'utilisateur ${user.pseudo} a bien été ${active ? 'activé' : 'désactivé'}`,
                    duration: 2,
                    placement: 'top',
                });
                setRefresh(refresh + 1);
            })
            .catch((err) => {
                notification.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
    };

    const onModalOk = async (pseudo: string) => {
        await deleteUser(pseudo)
            .then((res) => {
                notification.success({
                    message: `L'utilisateur ${pseudo} a bien été supprimé`,
                    duration: 2,
                    placement: 'top',
                });
            })
            .catch((err) => {
                notification.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
    };

    const deleteAccountModal = (pseudo: string) => {
        modal.confirm({
            title: `Voulez-vous supprimer le compte de ${pseudo} ?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Confirmer',
            okButtonProps: {
                danger: true,
            },
            onOk: () => onModalOk(pseudo),
            cancelText: 'Annuler',
            content: (
                <div style={{ fontSize: '16px', marginBottom: '20px' }}>
                    Attention, cette action est irréversible
                </div>
            ),
        });
    };

    const columns = [
        {
            title: 'Pseudo',
            dataIndex: 'pseudo',
            key: 'pseudo',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: ResponseUser) => (
                <Space size="middle">
                    {record.active ? (
                        <Button
                            onClick={() => updateActiveUser(record, false)}
                            danger
                        >
                            Désactiver
                        </Button>
                    ) : (
                        <Button onClick={() => updateActiveUser(record, true)}>
                            Activer
                        </Button>
                    )}
                    <Button
                        onClick={() => deleteAccountModal(record.pseudo)}
                        type="primary"
                        danger
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        document.title = 'Admin';
    }, []);

    useEffect(() => {
        getUsers(page, size, search)
            .then((res) => {
                setUsers(res.data);
                setTotalCount(res.headers['x-total-count']);
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content:
                        'Une erreur est survenue lors de la récupération des utilisateurs',
                });
            });
    }, [page, size, search, refresh]);

    return (
        <div className={styles.page}>
            <h2 style={{ textAlign: 'center' }}>Gestion des utilisateurs</h2>
            <Input
                placeholder="Rechercher par pseudo ou email"
                style={{ marginBottom: '20px', maxWidth: '400px' }}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Table
                rowKey="pseudo"
                dataSource={users}
                columns={columns}
                pagination={{
                    current: page,
                    pageSize: size,
                    showSizeChanger: true,
                    total: totalCount,
                    onChange: (page, size) => {
                        setPage(page);
                        setSize(size);
                    },
                }}
                bordered
            />
            {messageContextHolder}
            {modalContextHolder}
        </div>
    );
};

export default Admin;
