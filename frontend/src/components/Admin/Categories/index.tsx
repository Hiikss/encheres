import styles from '../Admin.module.css';
import {
    Button,
    Flex,
    Form,
    Input,
    message,
    Modal,
    notification,
    Space,
    Spin,
    Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Category } from '../../../types/Category';
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../../../services/CategoryService';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
} from '@ant-design/icons';

const AdminCategories = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [modal, modalContextHolder] = Modal.useModal();
    const [notificationApi, notificationContextHolder] =
        notification.useNotification();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const onCreateCategory = (category: Category) => {
        createCategory(category)
            .then((res) => {
                notificationApi.success({
                    message: `La catégorie a bien été créée`,
                    duration: 2,
                    placement: 'top',
                });
                setRefresh(refresh + 1);
            })
            .catch((err) => {
                notificationApi.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            });
    };

    const onUpdateCategory = async (label: string, category: Category) => {
        await updateCategory(label, category)
            .then((res) => {
                notificationApi.success({
                    message: `La catégorie a bien été modifiée`,
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

    const onModalOk = async (label: string) => {
        await deleteCategory(label)
            .then((res) => {
                notificationApi.success({
                    message: `La catégorie ${label} a bien été supprimée`,
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

    const deleteCategoryModal = (label: string) => {
        modal.confirm({
            title: `Voulez-vous vraiment supprimer la catégorie '${label}' ?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Confirmer',
            okButtonProps: {
                danger: true,
            },
            onOk: () => onModalOk(label),
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
            title: 'Catégorie',
            dataIndex: 'label',
            key: 'label',
            render: (text: string) => <Input id={text} defaultValue={text} />,
        },
        {
            title: 'Action',
            key: 'action',
            width: '30%',
            render: (record: Category) => (
                <Space size="middle">
                    <Button
                        onClick={() =>
                            onUpdateCategory(record.label, {
                                label: (
                                    document.getElementById(
                                        record.label
                                    ) as HTMLInputElement
                                ).value,
                            })
                        }
                    >
                        <EditOutlined />
                        Modifier
                    </Button>
                    <Button
                        onClick={() => deleteCategoryModal(record.label)}
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
        document.title = 'Gestion des catégories';
    }, []);

    useEffect(() => {
        getCategories()
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
            })
            .finally(() => setLoading(false));
    }, [refresh]);

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
    }
    return (
        <div className={`${styles.page} ${styles.categories}`}>
            {messageContextHolder}
            {notificationContextHolder}
            <h2 style={{ textAlign: 'center' }}>Gestion des catégories</h2>
            <Form onFinish={onCreateCategory} style={{ marginTop: '40px' }}>
                <div className={styles.form}>
                    <Form.Item<Category>
                        name="label"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner un libellé',
                            },
                        ]}
                    >
                        <Input placeholder="Ajouter une catégorie" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Ajouter
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <Table
                rowKey="label"
                dataSource={categories}
                columns={columns}
                scroll={{ x: true }}
                pagination={false}
                bordered
            />
            {modalContextHolder}
        </div>
    );
};

export default AdminCategories;
