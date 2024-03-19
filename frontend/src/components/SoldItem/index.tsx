import { ResponseSoldItem } from '../../types/SoldItem';
import { useEffect, useState } from 'react';
import { getSoldItem } from '../../services/SoldItemService';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, notification, Typography } from 'antd';
import styles from './SoldItem.module.css';
import { useAuth } from '../AuthProvider';
import SellForm from '../SellForm';

const SoldItem = () => {
    const { soldItemId } = useParams();
    const [soldItem, setSoldItem] = useState<ResponseSoldItem>();
    const [title, setTitle] = useState('Détail vente');
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
    }, []);

    useEffect(() => {
        if (soldItem?.auctionStartDate && soldItem.auctionEndDate) {
            if (
                new Date(soldItem?.auctionStartDate) <= new Date() &&
                new Date(soldItem?.auctionEndDate) > new Date()
            ) {
                setTitle('Vente en cours');
            } else if (new Date(soldItem?.auctionEndDate) <= new Date()) {
                if (soldItem.lastBidder) {
                    if (soldItem.lastBidder === auth.user.pseudo) {
                        setTitle('Vous avez remporté la vente');
                    } else {
                        setTitle(soldItem.lastBidder + ' a remporté la vente');
                    }
                } else {
                    setTitle('Vente terminée');
                }
            } else if (new Date(soldItem?.auctionStartDate) > new Date()) {
                setTitle('Vente à venir');
            }
        }
    }, [soldItem]);

    return (
        <Flex justify="center">
            {auth.user.pseudo === soldItem?.seller &&
            soldItem?.auctionStartDate &&
            new Date(soldItem?.auctionStartDate) > new Date() ? (
                <SellForm soldItemProp={soldItem}/>
            ) : (
                <div className={styles.profile}>
                    <h2 style={{ textAlign: 'center' }}>{title}</h2>
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
                        <div style={{ height: '19px' }}>
                            {soldItem?.lastBidder ? (
                                <span>
                                    {soldItem.sellPrice} points par{' '}
                                    <Typography.Link
                                        onClick={() =>
                                            navigate(
                                                `/profile/${soldItem?.lastBidder}`
                                            )
                                        }
                                    >
                                        {soldItem?.lastBidder}
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
                    <div className={styles.sellRow}>
                        <div>Retrait :</div>
                        <div>
                            {soldItem?.pickUpStreet},{' '}
                            {soldItem?.pickUpPostalCode} {soldItem?.pickUpCity}
                        </div>
                    </div>
                    <div className={styles.sellRow}>
                        <div>Vendeur :</div>
                        <div>{soldItem?.seller}</div>
                    </div>
                </div>
            )}
        </Flex>
    );
};

export default SoldItem;
