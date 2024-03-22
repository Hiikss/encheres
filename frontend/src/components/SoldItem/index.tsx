import { RequestSoldItem, ResponseSoldItem } from '../../types/SoldItem';
import React, { useEffect, useState } from 'react';
import { getSoldItem, updateSoldItem } from '../../services/SoldItemService';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Flex,
    Form,
    Image,
    InputNumber,
    List,
    notification,
    Spin,
    Typography,
} from 'antd';
import styles from './SoldItem.module.css';
import { useAuth } from '../AuthProvider';
import SellForm from '../SellForm';
import { RequestAuction, ResponseAuction } from '../../types/Auction';
import { createAuction, getAuctions } from '../../services/AuctionService';
import NotFound from '../NotFound';

type FieldType = {
    auctionPrice: number;
};

const SoldItem = () => {
    const { soldItemId } = useParams();
    const [soldItem, setSoldItem] = useState<ResponseSoldItem>();
    const [auctions, setAuctions] = useState<ResponseAuction[]>([]);
    const [lastAuction, setLastAuction] = useState<ResponseAuction>();
    const [title, setTitle] = useState('Détail vente');
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        document.title = 'Détail vente';
    }, []);

    useEffect(() => {
        if (soldItemId) {
            getSoldItem(soldItemId)
                .then((res) => {
                    setSoldItem(res.data);
                })
                .catch(() => {
                    setError(true);
                })
                .finally(() => setLoading(false));
        }
    }, [soldItemId, refresh]);

    useEffect(() => {
        if (soldItemId) {
            getAuctions(soldItemId)
                .then((res) => {
                    setAuctions(
                        res.data.slice().sort((a, b) => b.price - a.price)
                    );
                })
                .catch(() => {
                    notification.error({
                        message: 'Une erreur est survenue',
                        placement: 'top',
                    });
                });
        }
    }, [soldItemId, refresh]);

    useEffect(() => {
        if (auctions.length > 0) {
            setLastAuction(
                auctions.reduce((prev, current) =>
                    prev.price > current.price ? prev : current
                )
            );
        }
    }, [auctions]);

    useEffect(() => {
        if (soldItem?.auctionStartDate && soldItem.auctionEndDate) {
            if (
                new Date(soldItem?.auctionStartDate) <= new Date() &&
                new Date(soldItem?.auctionEndDate) > new Date()
            ) {
                setTitle('Vente en cours');
            } else if (new Date(soldItem?.auctionEndDate) <= new Date()) {
                if (lastAuction?.bidder) {
                    if (lastAuction.bidder === auth.user.pseudo) {
                        setTitle('Vous avez remporté la vente');
                    } else {
                        setTitle(lastAuction.bidder + ' a remporté la vente');
                    }
                } else {
                    setTitle('Vente terminée');
                }
            } else if (new Date(soldItem?.auctionStartDate) > new Date()) {
                setTitle('Vente à venir');
            }
        }
    }, [soldItem, lastAuction]);

    const onPickUp = async () => {
        if (soldItem) {
            const requestSoldItem: RequestSoldItem = {
                itemName: soldItem.itemName,
                description: soldItem.description,
                imageUrl: soldItem.imageUrl,
                auctionStartDate: soldItem.auctionStartDate,
                auctionEndDate: soldItem.auctionEndDate,
                startPrice: soldItem.startPrice,
                sellPrice: soldItem.sellPrice,
                pickUpStreet: soldItem.pickUpStreet,
                pickUpPostalCode: soldItem.pickUpPostalCode,
                pickUpCity: soldItem.pickUpCity,
                pickUpDone: true,
                categoryLabel: soldItem.category,
            };
            await updateSoldItem(soldItem?.id, requestSoldItem)
                .then(() => {
                    notification.success({
                        message: "Vous avez notifié le retrait de l'article",
                        duration: 2,
                        placement: 'top',
                    });
                })
                .catch(() => {
                    notification.error({
                        message: 'Une erreur est survenue',
                        duration: 2,
                        placement: 'top',
                    });
                });
            setRefresh(refresh + 1);
        }
    };

    const onAuctionSubmit = async (values: FieldType) => {
        if (soldItem) {
            const auction: RequestAuction = {
                auctionPrice: values.auctionPrice,
                soldItemId: soldItem.id,
            };

            await createAuction(auction)
                .then(() => {
                    notification.success({
                        message: 'Vous avez enchéri',
                        duration: 2,
                        placement: 'top',
                    });
                })
                .catch(() => {
                    notification.error({
                        message: 'Une erreur est survenue',
                        duration: 2,
                        placement: 'top',
                    });
                });
            setRefresh(refresh + 1);
            auth.refreshUser();
        }
    };

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
    } else if (error) {
        return <NotFound />;
    }
    return (
        <Flex justify="center">
            {auth.user.pseudo === soldItem?.seller &&
            soldItem?.auctionStartDate &&
            new Date(soldItem?.auctionStartDate) > new Date() ? (
                <SellForm soldItemProp={soldItem} />
            ) : (
                <div className={styles.soldItem}>
                    <h2 style={{ textAlign: 'center' }}>{title}</h2>
                    <hr style={{ color: '#6b7280', width: '110px' }} />
                    <h4
                        style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: '600',
                        }}
                    >
                        {soldItem?.itemName}
                    </h4>
                    <Flex justify="center">
                        <Image
                            src={soldItem?.imageUrl}
                            style={{ borderRadius: '6px', maxHeight: '250px' }}
                            fallback="data:image/png;base64,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"
                        />
                    </Flex>
                    <div className={styles.sellRow}>
                        <div>Description :</div>
                        <div style={{ overflowY: 'auto', maxHeight: '100px' }}>
                            {soldItem?.description}
                        </div>
                    </div>
                    <div className={styles.sellRow}>
                        <div>Catégorie :</div>
                        <div>{soldItem?.category}</div>
                    </div>
                    <div className={styles.sellRow}>
                        <div>Meilleur offre :</div>
                        <div>
                            {lastAuction?.bidder ? (
                                <span>
                                    {lastAuction.price} points par{' '}
                                    <Typography.Link
                                        style={{ lineHeight: 'unset' }}
                                        onClick={() =>
                                            navigate(
                                                `/profile/${lastAuction?.bidder}`
                                            )
                                        }
                                    >
                                        {lastAuction?.bidder}
                                    </Typography.Link>
                                </span>
                            ) : (
                                'Aucune enchère'
                            )}
                        </div>
                    </div>
                    <div className={styles.sellRow}>
                        <div>Mise à prix :</div>
                        <div>{soldItem?.startPrice} points</div>
                    </div>
                    {soldItem?.auctionStartDate &&
                    new Date(soldItem?.auctionStartDate) > new Date() ? (
                        <div className={styles.sellRow}>
                            <div>Début de l'enchère :</div>
                            <div>
                                {' '}
                                {soldItem?.auctionStartDate
                                    ? new Date(
                                          soldItem?.auctionStartDate
                                      ).toLocaleDateString()
                                    : 'Date indisponible'}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.sellRow}>
                            <div>Fin de l'enchère :</div>
                            <div>
                                {' '}
                                {soldItem?.auctionEndDate
                                    ? new Date(
                                          soldItem?.auctionEndDate
                                      ).toLocaleDateString()
                                    : 'Date indisponible'}
                            </div>
                        </div>
                    )}
                    <div className={styles.sellRow}>
                        <div>Retrait :</div>
                        <div>
                            {soldItem?.pickUpStreet},{' '}
                            {soldItem?.pickUpPostalCode} {soldItem?.pickUpCity}
                        </div>
                    </div>
                    <div className={styles.sellRow}>
                        <div>Vendeur :</div>
                        <div>
                            <Typography.Link
                                style={{ lineHeight: 'unset' }}
                                onClick={() =>
                                    navigate(`/profile/${soldItem?.seller}`)
                                }
                            >
                                {soldItem?.seller}
                            </Typography.Link>
                        </div>
                    </div>
                    {auth.user.pseudo === soldItem?.seller &&
                        soldItem?.auctionEndDate &&
                        new Date(soldItem?.auctionEndDate) <= new Date() &&
                        (soldItem.pickUpDone ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    marginTop: '30px',
                                }}
                            >
                                Le retrait a été effectué
                            </div>
                        ) : (
                            <Button
                                onClick={onPickUp}
                                size="large"
                                block
                                style={{ marginTop: '30px' }}
                            >
                                Retrait effectué
                            </Button>
                        ))}
                    {auth.user.pseudo !== soldItem?.seller &&
                        soldItem?.auctionEndDate &&
                        new Date(soldItem?.auctionEndDate) > new Date() &&
                        soldItem?.auctionStartDate &&
                        new Date(soldItem?.auctionStartDate) <= new Date() &&
                        (auth.user.pseudo === lastAuction?.bidder ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    marginTop: '30px',
                                }}
                            >
                                Vous avez déjà enchéri, vous devez attendre que
                                quelqu'un d'autre enchérisse
                            </div>
                        ) : (
                            <Form onFinish={onAuctionSubmit}>
                                <Form.Item label="Ma proposition">
                                    <Form.Item<FieldType>
                                        name="auctionPrice"
                                        initialValue={
                                            lastAuction
                                                ? lastAuction?.price + 1
                                                : soldItem.sellPrice + 1
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Veuillez renseigner votre proposition',
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <InputNumber
                                            min={
                                                lastAuction
                                                    ? lastAuction?.price + 1
                                                    : soldItem.sellPrice + 1
                                            }
                                            max={auth.user.credit}
                                            placeholder="100"
                                        />
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
                                <div>
                                    Votre solde de point : {auth.user.credit}
                                </div>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        size="large"
                                        block
                                        style={{ marginTop: '30px' }}
                                    >
                                        Enchérir
                                    </Button>
                                </Form.Item>
                            </Form>
                        ))}
                    {auth.user.pseudo === soldItem?.seller &&
                        (auctions.length > 0 ? (
                            <>
                                <div
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        marginTop: '10px',
                                    }}
                                >
                                    Liste des enchères :
                                </div>
                                <List
                                    dataSource={auctions}
                                    renderItem={(auction) => (
                                        <List.Item>
                                            {auction.bidder} a enchéri{' '}
                                            {auction.price} points le{' '}
                                            {new Date(
                                                auction.date
                                            ).toLocaleDateString()}{' '}
                                        </List.Item>
                                    )}
                                    style={{
                                        overflowY: 'auto',
                                        maxHeight: '300px',
                                    }}
                                />
                            </>
                        ) : (
                            <div
                                style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    marginTop: '10px',
                                    textAlign: 'center',
                                }}
                            >
                                Aucune enchère n'a été faite
                            </div>
                        ))}
                </div>
            )}
        </Flex>
    );
};

export default SoldItem;
