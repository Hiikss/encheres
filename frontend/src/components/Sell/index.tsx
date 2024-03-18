import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import {
    Button,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    message, notification,
    Select,
    Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Category } from '../../types/Category';
import { getCategories } from '../../services/CategoryService';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './Sell.module.css';
import { RequestSoldItem } from '../../types/SoldItem';
import { createSoldItem } from '../../services/SoldItemService';
import { useNavigate } from 'react-router-dom';

// const normFile = (e: any) => {
//     console.log('Upload event:', e);
//     if (Array.isArray(e)) {
//         return e;
//     }
//     return e?.fileList;
// };

type FieldType = {
    itemName: string;
    description: string;
    categoryLabel: string;
    startPrice: number;
    dates: any;
    pickUpStreet: string;
    pickUpPostalCode: string;
    pickUpCity: string;
    image: any;
};

const Sell = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [categories, setCategories] = useState<Category[]>([]);
    const auth = useAuth();
    const navigate = useNavigate()

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

    const onSubmit = async (values: FieldType) => {
        const soldItem: RequestSoldItem = {
            itemName: values.itemName.trim(),
            description: values.description.trim(),
            categoryLabel: values.categoryLabel,
            startPrice: values.startPrice,
            sellPrice: values.startPrice,
            auctionStartDate: values.dates[0].format('YYYY-MM-DD'),
            auctionEndDate: values.dates[1].format('YYYY-MM-DD'),
            pickUpStreet: values.pickUpStreet,
            pickUpPostalCode: values.pickUpPostalCode,
            pickUpCity: values.pickUpCity,
            pickUpDone: false
        }
        await createSoldItem(soldItem).then((res) => {
            notification.success({
                message: 'La vente a bien été créée',
                duration: 2,
                placement: 'top',
            });
            navigate(`/solditem/${res.data.id}`)
        }).catch((err) => {
                notification.error({
                    message: 'Une erreur est survenue',
                    duration: 2,
                    placement: 'top',
                });
            }
        )
    };

    return (
        <Flex justify="center">
            <div className={styles.sellForm}>
                {contextHolder}
                <h3
                    style={{
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '22px',
                    }}
                >
                    Vendre un article
                </h3>
                <hr style={{ color: '#6b7280', width: '110px' }} />
                <Form onFinish={onSubmit} layout="vertical">
                    <Form.Item<FieldType>
                        label="Article"
                        name="itemName"
                        rules={[
                            {
                                required: true,
                                message: "Veuillez renseigner un nom d'article",
                            },
                        ]}
                    >
                        <Input placeholder="Nom de l'article"/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez renseigner une description',
                            },
                        ]}
                    >
                        <TextArea rows={4} style={{ resize: 'none' }} placeholder="Description de l'article" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Categorie"
                        name="categoryLabel"
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
                        name="image"
                        label="Photo de l'article"
                        // valuePropName="fileList"
                        // getValueFromEvent={normFile}
                        // extra="longgggggggggggggggggggggggggggggggggg"
                    >
                        <Upload
                            // name="logo"
                            // action="/upload.do"
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>
                                Click to upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Mise à prix">
                        <Form.Item
                            name="startPrice"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Veuillez renseigner une mise à prix',
                                },
                            ]}
                            noStyle
                        >
                            <InputNumber min={1} max={10} placeholder="100"/>
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
                    <div style={{ fontSize: '18px'}}>Retrait</div>
                    <Form.Item<FieldType>
                        label="Rue"
                        name="pickUpStreet"
                        initialValue={auth.user?.street}
                        rules={[
                            {
                                required: true,
                                message: "Veuillez renseigner une rue",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Code postal"
                        name="pickUpPostalCode"
                        initialValue={auth.user?.postalCode}
                        rules={[
                            {
                                required: true,
                                message: "Veuillez renseigner un code postal",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Ville"
                        name="pickUpCity"
                        initialValue={auth.user?.city}
                        rules={[
                            {
                                required: true,
                                message: "Veuillez renseigner une ville",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
                </Form>
            </div>
        </Flex>
    );
};

export default Sell;
