import { ResponseSoldItem } from '../../types/SoldItem';
import { useEffect, useState } from 'react';
import { getSoldItem } from '../../services/SoldItemService';
import { useNavigate, useParams } from 'react-router-dom';
import { notification } from 'antd';

const SoldItem = () => {
    const { soldItemId } = useParams();
    const [soldItem, setSoldItem] = useState<ResponseSoldItem>()
const navigate = useNavigate();

    useEffect(() => {
        if(soldItemId) {
            getSoldItem(soldItemId).then((res) => {
                setSoldItem(res.data)
            }).catch((err) => {
                if(err.response.status===404) {
                    navigate('/*')
                } else {
                    notification.error({
                        message: 'Une erreur est survenue',
                        placement: 'top',
                    });
                    navigate('/')
                }
            })
        }
    }, []);

    return (
        <div>{soldItem?.itemName}</div>
    )
}

export default SoldItem