import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Drawer,
    Empty,
    Flex,
    Form,
    Image,
    Input,
    message,
    Pagination,
    Radio,
    Select,
    Spin,
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
    const [loading, setLoading] = useState(true);
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
            })
            .finally(() => setLoading(false));
    }, [formSubmitted, page, size]);

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
            {contextHolder}
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
                    {loading ? (
                        <Flex
                            justify="center"
                            align="center"
                            style={{ marginTop: '200px' }}
                        >
                            <Spin size="large" />
                        </Flex>
                    ) : (
                        <>
                            {soldItems.length > 0 ? (
                                <>
                                    <div className={styles.cardList}>
                                        {soldItems.map((soldItem) => (
                                            <Card
                                                title={soldItem.itemName}
                                                key={soldItem.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/solditem/${soldItem.id}`
                                                    )
                                                }
                                                bordered={false}
                                                style={{
                                                    flex: 1,
                                                    minWidth: '230px',
                                                }}
                                                hoverable
                                            >
                                                <div className={styles.card}>
                                                    <Image
                                                        preview={false}
                                                        src={soldItem?.imageUrl}
                                                        style={{
                                                            borderRadius: '6px',
                                                            maxHeight: '120px',
                                                        }}
                                                        fallback="data:image/png;base64,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"
                                                    />
                                                    <Flex justify={'flex-end'} align={'center'} style={{flex:'1'}}>
                                                        <div>
                                                            <div>
                                                                Prix :{' '}
                                                                {
                                                                    soldItem.sellPrice
                                                                }
                                                            </div>
                                                            <div>
                                                                Fin de l'enchère
                                                                :{' '}
                                                                {new Date(
                                                                    soldItem.auctionEndDate
                                                                ).toLocaleDateString()}
                                                            </div>
                                                            <div>
                                                                Vendeur :{' '}
                                                                {
                                                                    soldItem.seller
                                                                }
                                                            </div>
                                                        </div>
                                                    </Flex>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    <Pagination
                                        current={page}
                                        pageSize={size}
                                        total={totalCount}
                                        onChange={(page, pageSize) => {
                                            setPage(page);
                                            setSize(pageSize);
                                        }}
                                        showSizeChanger
                                        style={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                            textAlign: 'end',
                                        }}
                                    />
                                </>
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                                    description="Aucun article trouvé"
                                />
                            )}
                        </>
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
