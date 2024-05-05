import React, { useEffect, useState } from 'react';
import { PartialUserRequest, RequestUser, ResponseUser } from '../../../types/User';
import {
    deleteUser,
    getUsers, updatePartiallyUser,
    updateUser,
} from '../../../services/UserService';
import {
    Button, Flex,
    Input,
    message,
    Modal,
    notification,
    Space, Spin,
    Table,
} from 'antd';
import styles from '../Admin.module.css';
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
} from '@ant-design/icons';

const AdminUsers = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [modal, modalContextHolder] = Modal.useModal();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [users, setUsers] = useState<ResponseUser[]>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    const updateActiveUser = async (user: ResponseUser, active: boolean) => {
        const userToUpdate: PartialUserRequest = {
            pseudo: user.pseudo,
            active: active,
        };
        await updatePartiallyUser(userToUpdate)
            .then((res) => {
                notificationApi.success({
                    message: `L'utilisateur ${user.pseudo} a bien été ${active ? 'activé' : 'désactivé'}`,
                    duration: 2,
                    placement: 'top',
                });
            })
            .catch((err) => {
                notificationApi.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
        setRefresh(refresh + 1);
    };

    const onModalOk = async (pseudo: string) => {
        await deleteUser(pseudo)
            .then((res) => {
                notificationApi.success({
                    message: `L'utilisateur ${pseudo} a bien été supprimé`,
                    duration: 2,
                    placement: 'top',
                });
            })
            .catch((err) => {
                notificationApi.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
        setRefresh(refresh + 1);
    };

    const deleteAccountModal = (pseudo: string) => {
        modal.confirm({
            title: `Voulez-vous vraiment supprimer le compte de ${pseudo} ?`,
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
            width: '30%',
            render: (record: ResponseUser) => (
                <Space size="middle">
                    {record.active ? (
                        <Button
                            onClick={() => updateActiveUser(record, false)}
                            danger
                        >
                            <CloseOutlined />
                            Désactiver
                        </Button>
                    ) : (
                        <Button onClick={() => updateActiveUser(record, true)}>
                            <CheckOutlined />
                            Activer
                        </Button>
                    )}
                    <Button
                        onClick={() => deleteAccountModal(record.pseudo)}
                        type="primary"
                        danger
                    >
                        <DeleteOutlined />
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        document.title = 'Gestion des utilisateurs';
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
            }).finally(() => setLoading(false));;
    }, [page, size, search, refresh]);

    if(loading) {
        return (
            <Flex justify="center" align="center" style={{marginTop:'200px'}}>
                <Spin size="large" />
            </Flex>)
    }
    return (
        <div className={`${styles.page} ${styles.users}`}>
            {messageContextHolder}
            {notificationContextHolder}
            <h2 style={{ textAlign: 'center' }}>Gestion des utilisateurs</h2>
            <Input
                placeholder="Rechercher par pseudo ou email"
                style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    maxWidth: '400px',
                }}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Table
                rowKey="pseudo"
                dataSource={users}
                columns={columns}
                scroll={{ x: true }}
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
            {modalContextHolder}
        </div>
    );
};

export default AdminUsers;
