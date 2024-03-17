import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Drawer,
    Empty,
    Flex,
    Form,
    Input,
    message,
    Radio,
    Select,
} from 'antd';
import { useAuth, UserContextType } from '../AuthProvider';
import { ResponseSoldItem } from '../../types/SoldItem';
import { getSoldItems } from '../../services/SoldItemService';
import { Category } from '../../types/Category';
import { getCategories } from '../../services/CategoryService';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';

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
    const [totalCount, setTotalCount] = useState<number>(0);
    const [itemName, setItemName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [filters, setFilters] = useState<string[]>(['opened']);
    const [firstRadio, setFirstRadio] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(0);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
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
                setTotalCount(+res.headers['x-total-count']);
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
            });
    }, [formSubmitted]);

    const onFormSubmit = (values: FieldType) => {
        setFilterMenuOpen(false);
        setItemName(values.itemName);
        setCategory(values.category);
        if (auth.user) {
            setFilters(firstRadio ? values.auctions : values.sells);
        } else {
            setFilters(['opened']);
        }
        setFormSubmitted(formSubmitted + 1);
    };

    return (
        <div className={styles.page}>
            <div className={styles.desktopFilters}>
                <Filters
                    onFormSubmit={onFormSubmit}
                    categories={categories}
                    auth={auth}
                    firstRadio={firstRadio}
                    setFirstRadio={setFirstRadio}
                />
            </div>
            <div className={styles.mobileFilters}>
                <Drawer
                    id="mobileFilters"
                    open={filterMenuOpen}
                    onClose={() => setFilterMenuOpen(false)}
                >
                    <Filters
                        onFormSubmit={onFormSubmit}
                        categories={categories}
                        auth={auth}
                        firstRadio={firstRadio}
                        setFirstRadio={setFirstRadio}
                        className={styles.mobileFilters}
                    />
                </Drawer>
            </div>
            <div className={styles.itemList}>
                <h2 style={{ textAlign: 'center' }}>Liste des enchères</h2>
                <Button
                    onClick={() => setFilterMenuOpen(true)}
                    size="large"
                    className={styles.mobileFilters}
                >
                    <Flex align="center" gap="small">
                        <MixerHorizontalIcon />
                        Filtres de recherche
                    </Flex>
                </Button>
                <div style={{ marginTop: '30px' }}>
                    {soldItems.length > 0 ? (
                        <Flex wrap="wrap" gap={30}>
                            {soldItems.map((soldItem) => (
                                <Card
                                    title={soldItem.itemName}
                                    key={soldItem.id}
                                    onClick={() =>
                                        navigate(`/solditem/${soldItem.id}`)
                                    }
                                    bordered={false}
                                    style={{ flex: 1, minWidth: '230px' }}
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
                        </Flex>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description="Aucun article trouvé"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Filters = ({
    onFormSubmit,
    categories,
    auth,
    firstRadio,
    setFirstRadio,
    className,
}: {
    onFormSubmit: (values: FieldType) => void;
    categories: Category[];
    auth: UserContextType;
    firstRadio: boolean;
    setFirstRadio: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) => {
    return (
        <div className={className}>
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
                    <Radio.Group
                        defaultValue="achats"
                        className={styles.radioGroup}
                    >
                        <div>
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
                                <Checkbox.Group
                                    disabled={!firstRadio}
                                    className={styles.checkboxGroup}
                                >
                                    <Checkbox value="opened">
                                        Enchères ouvertes
                                    </Checkbox>
                                    <Checkbox value="mine">
                                        Mes enchères
                                    </Checkbox>
                                    <Checkbox value="won">
                                        Enchères remportées
                                    </Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </div>
                        <div>
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
                                <Checkbox.Group
                                    disabled={firstRadio}
                                    className={styles.checkboxGroup}
                                >
                                    <Checkbox value="inProgress">
                                        Ventes en cours
                                    </Checkbox>
                                    <Checkbox value="notStarted">
                                        Ventes non débutées
                                    </Checkbox>
                                    <Checkbox value="over">
                                        Ventes terminées
                                    </Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </div>
                    </Radio.Group>
                )}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        style={{ marginTop: '10px' }}
                    >
                        Rechercher
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Home;
