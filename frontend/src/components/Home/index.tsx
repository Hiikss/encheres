import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    message,
    Radio,
    Select,
} from 'antd';
import { useAuth } from '../AuthProvider';
import { ResponseSoldItem } from '../../types/SoldItem';
import { getSoldItems } from '../../services/SoldItemService';
import { Category } from '../../types/Category';
import { getCategories } from '../../services/CategoryService';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { SearchOutlined } from '@ant-design/icons';

type FieldType = {
    itemName: string;
    category: string;
    auctions: string[];
    sells: string[];
};

const Home = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [soldItems, setSoldItems] = useState<ResponseSoldItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [itemName, setItemName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [filters, setFilters] = useState<string[]>([]);
    const [firstRadio, setFirstRadio] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(0);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        document.title = 'Accueil';
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

    useEffect(() => {
        getSoldItems(page, size, itemName, category, filters)
            .then((res) => {
                setSoldItems(res.data);
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
            });
    }, [formSubmitted]);

    const onFormSubmit = (values: FieldType) => {
        setItemName(values.itemName);
        setCategory(values.category);
        setFilters(firstRadio ? values.auctions : values.sells);
        setFormSubmitted(formSubmitted + 1);
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Liste des enchères</h2>
            <div>
                <Form onFinish={onFormSubmit}>
                    <Form.Item<FieldType> name="itemName" initialValue="">
                        <Input
                            placeholder="Le nom de l'article contient"
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Categorie"
                        name="category"
                        initialValue=""
                    >
                        <Select>
                            <Select.Option value="">Toutes</Select.Option>
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
                    {auth.user && (
                        <Radio.Group defaultValue="achats">
                            <Radio
                                value="achats"
                                onClick={() => setFirstRadio(true)}
                            >
                                Achats
                            </Radio>
                            <Form.Item<FieldType>
                                name="auctions"
                                initialValue={['opened']}
                            >
                                <Checkbox.Group disabled={!firstRadio}>
                                    <Checkbox value="opened">
                                        Enchères ouvertes
                                    </Checkbox>
                                    <Checkbox value="mine">
                                        Mes enchères
                                    </Checkbox>
                                    <Checkbox value="won">
                                        Mes enchères remportées
                                    </Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                            <Radio
                                value="ventes"
                                onClick={() => setFirstRadio(false)}
                            >
                                Mes ventes
                            </Radio>
                            <Form.Item<FieldType>
                                name="sells"
                                initialValue={[]}
                            >
                                <Checkbox.Group disabled={firstRadio}>
                                    <Checkbox value="inProgress">
                                        Mes ventes en cours
                                    </Checkbox>
                                    <Checkbox value="notStarted">
                                        Ventes non débutées
                                    </Checkbox>
                                    <Checkbox value="over">
                                        Ventes terminées
                                    </Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Radio.Group>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            Rechercher
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    columnGap: '20px',
                }}
                className={styles.itemList}
            >
                {soldItems.map((soldItem) => (
                    <Card
                        title={soldItem.itemName}
                        key={soldItem.id}
                        onClick={() => navigate(`/solditem/${soldItem.id}`)}
                        bordered={false}
                        hoverable
                    >
                        <div>
                            <div>Prix : {soldItem.sellPrice}</div>
                            <div>
                                Fin de l'enchère :{' '}
                                {new Date(
                                    soldItem.auctionEndDate
                                ).toLocaleDateString()}
                            </div>
                            <div>Vender : {soldItem.seller}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Home;
