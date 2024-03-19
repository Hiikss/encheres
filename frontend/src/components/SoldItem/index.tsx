import { RequestSoldItem, ResponseSoldItem } from '../../types/SoldItem';
import React, { useEffect, useState } from 'react';
import { getSoldItem, updateSoldItem } from '../../services/SoldItemService';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Flex,
    Form,
    InputNumber,
    List,
    notification,
    Typography,
} from 'antd';
import styles from './SoldItem.module.css';
import { useAuth } from '../AuthProvider';
import SellForm from '../SellForm';
import { RequestAuction, ResponseAuction } from '../../types/Auction';
import { createAuction, getAuctions } from '../../services/AuctionService';

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
                .catch((err) => {
                    if (err.response.status === 404) {
                        navigate('/*');
                    } else {
                        notification.error({
                            message: 'Une erreur est survenue',
                            placement: 'top',
                        });
                        navigate('/');
                    }
                });
        }
    }, [refresh]);

    useEffect(() => {
        if (soldItemId) {
            getAuctions(soldItemId)
                .then((res) => {
                    setAuctions(
                        res.data.slice().sort((a, b) => b.price - a.price)
                    );
                })
                .catch((err) => {
                    notification.error({
                        message: 'Une erreur est survenue',
                        placement: 'top',
                    });
                });
        }
    }, [refresh]);

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
                itemName: soldItem?.itemName,
                description: soldItem.description,
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
                .then((res) => {
                    notification.success({
                        message: "Vous avez notifié le retrait de l'article",
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
                .then((res) => {
                    notification.success({
                        message: 'Vous avez enchéri',
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
            setRefresh(refresh + 1);
            auth.refreshUser();
        }
    };

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
                                                lastAuction?.price &&
                                                lastAuction?.price + 1
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
                            <div>Aucune enchère n'a été faite</div>
                        ))}
                </div>
            )}
        </Flex>
    );
};

export default SoldItem;
