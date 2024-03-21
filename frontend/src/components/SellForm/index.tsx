import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import {
    Button,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    ModalFuncProps,
    notification,
    Select,
    Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Category } from '../../types/Category';
import { getCategories } from '../../services/CategoryService';
import { ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './SellForm.module.css';
import { RequestSoldItem, ResponseSoldItem } from '../../types/SoldItem';
import {
    createSoldItem,
    deleteSoldItem,
    updateSoldItem,
} from '../../services/SoldItemService';
import { useNavigate } from 'react-router-dom';

type FieldType = {
    itemName: string;
    description: string;
    categoryLabel: string;
    imageUrl: string;
    startPrice: number;
    dates: any;
    pickUpStreet: string;
    pickUpPostalCode: string;
    pickUpCity: string;
    image: any;
};

const SellForm = ({ soldItemProp }: { soldItemProp?: ResponseSoldItem }) => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [modal, modalContextHolder] = Modal.useModal();
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Vendre un article';
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
            });
    }, []);

    const onDeleteSell = async () => {
        if (soldItemProp) {
            await deleteSoldItem(soldItemProp.id)
                .then((res) => {
                    notification.success({
                        message: 'La vente a bien été supprimée',
                        duration: 2,
                        placement: 'top',
                    });
                    navigate(`/`);
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

    const deleteSellModal: ModalFuncProps = {
        title: 'Voulez-vous vraiment supprimer cette vente ?',
        icon: <ExclamationCircleFilled />,
        okText: 'Confirmer',
        okButtonProps: {
            danger: true,
        },
        onOk: onDeleteSell,
        cancelText: 'Annuler',
        content: (
            <div style={{ fontSize: '16px', marginBottom: '20px' }}>
                Attention, cette action est irréversible
            </div>
        ),
    };

    const onSubmit = async (values: FieldType) => {
        const soldItem: RequestSoldItem = {
            itemName: values.itemName.trim(),
            description: values.description.trim(),
            imageUrl: values.imageUrl.trim(),
            categoryLabel: values.categoryLabel,
            startPrice: values.startPrice,
            sellPrice: values.startPrice,
            auctionStartDate: values.dates[0].format('YYYY-MM-DD'),
            auctionEndDate: values.dates[1].format('YYYY-MM-DD'),
            pickUpStreet: values.pickUpStreet.trim(),
            pickUpPostalCode: values.pickUpPostalCode.trim(),
            pickUpCity: values.pickUpCity.trim(),
            pickUpDone: false,
        };

        if (soldItemProp) {
            await updateSoldItem(soldItemProp.id, soldItem)
                .then((res) => {
                    notification.success({
                        message: 'La vente a bien été modifiée',
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
        } else {
            await createSoldItem(soldItem)
                .then((res) => {
                    notification.success({
                        message: 'La vente a bien été créée',
                        duration: 2,
                        placement: 'top',
                    });
                    navigate(`/solditem/${res.data.id}`);
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

    return (
        <div className={styles.sellForm}>
            {messageContextHolder}
            <h3
                style={{
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '22px',
                }}
            >
                {soldItemProp ? 'Modifier un article' : 'Vendre un article'}
            </h3>
            <hr style={{ color: '#6b7280', width: '110px' }} />
            <Form onFinish={onSubmit} layout="vertical">
                <Form.Item<FieldType>
                    label="Article"
                    name="itemName"
                    initialValue={soldItemProp?.itemName}
                    rules={[
                        {
                            required: true,
                            message: "Veuillez renseigner un nom d'article",
                        },
                    ]}
                >
                    <Input placeholder="Nom de l'article" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                    initialValue={soldItemProp?.description}
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner une description',
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        style={{ resize: 'none' }}
                        placeholder="Description de l'article"
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Categorie"
                    name="categoryLabel"
                    initialValue={soldItemProp?.category}
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner une catégorie',
                        },
                    ]}
                >
                    <Select placeholder="Choisir une catégorie">
                        {categories.map((category) => (
                            <Select.Option
                                value={category.label}
                                key={category.label}
                            >
                                {category.label.charAt(0).toUpperCase() +
                                    category.label.slice(1)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Lien d'image"
                    name="imageUrl"
                    initialValue={soldItemProp?.imageUrl}
                    rules={[
                        {
                            pattern: /(https?:\/\/.*\.(?:png|jpg))/,
                            required: true,
                            message: "Veuillez renseigner l'URL d'une image",
                        },
                    ]}
                >
                    <Input placeholder="https://www.eni-ecole.fr/wp-content/uploads/2022/08/logo_eni.png" />
                </Form.Item>
                <Form.Item label="Mise à prix">
                    <Form.Item<FieldType>
                        name="startPrice"
                        initialValue={soldItemProp?.startPrice}
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner une mise à prix',
                            },
                        ]}
                        noStyle
                    >
                        <InputNumber min={1} placeholder="100" />
                    </Form.Item>
                    <span
                        className="ant-form-text"
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        points
                    </span>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Dates"
                    name="dates"
                    initialValue={
                        soldItemProp && [
                            dayjs(soldItemProp?.auctionStartDate),
                            dayjs(soldItemProp?.auctionEndDate),
                        ]
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner les dates',
                        },
                    ]}
                >
                    <DatePicker.RangePicker
                        minDate={dayjs()}
                        placeholder={['Date de début', 'Date de fin']}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>
                <div style={{ fontSize: '18px' }}>Retrait</div>
                <Form.Item<FieldType>
                    label="Rue"
                    name="pickUpStreet"
                    initialValue={
                        soldItemProp
                            ? soldItemProp.pickUpStreet
                            : auth.user?.street
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner une rue',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Code postal"
                    name="pickUpPostalCode"
                    initialValue={
                        soldItemProp
                            ? soldItemProp.pickUpPostalCode
                            : auth.user?.postalCode
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner un code postal',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Ville"
                    name="pickUpCity"
                    initialValue={
                        soldItemProp ? soldItemProp.pickUpCity : auth.user?.city
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez renseigner une ville',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className={soldItemProp && styles.buttons}>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            style={{ marginTop: '10px' }}
                        >
                            Enregistrer
                        </Button>
                    </Form.Item>
                    {soldItemProp && (
                        <Button
                            size="large"
                            onClick={async () =>
                                await modal.confirm(deleteSellModal)
                            }
                            block
                            style={{ marginTop: '10px' }}
                            danger
                        >
                            Annuler la vente
                        </Button>
                    )}
                </div>
            </Form>
            {modalContextHolder}
        </div>
    );
};

export default SellForm;
