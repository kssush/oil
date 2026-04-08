import React, { useEffect, useState } from "react";
import st from "./UpdateRate.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import api from '../../api'; 

const UpdateRate = () => {
    const userId = localStorage.getItem("userId");

    const { from } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currencyCode: from,
        buyPrice: '',
        sellPrice: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [currencies, setCurrencies] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const payload = {
            userId: userId,
            currencyCode: formData.currencyCode,
            buyPrice: parseFloat(formData.buyPrice), 
            sellPrice: parseFloat(formData.sellPrice) 
        };

        try {
            await api.put('/rates', payload);

            setMessage({ type: 'success', text: 'Курс успешно обновлен!' });
            
            setFormData({ currencyCode: '', buyPrice: '', sellPrice: '' });
            
        } catch (err) {
            const errorText = err.response?.data?.error || "Ошибка соединения";
            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
       const fetchCurrencies = async () => {
            try {
                setLoading(true);
                const result = await api.get('/currencies'); 

                setCurrencies(result.data); 
            } catch (err) {
                const errorText = err.response?.data?.error || "Ошибка соединения";
                setMessage({ type: 'error', text: errorText });
            } finally {
                setLoading(false);
            }
        };

        fetchCurrencies();
    }, [])

    useEffect(() => {
        if (!loading && currencies?.length > 0) {
            const isValidFrom = currencies.some(c => c.code === from);
        
            if (!isValidFrom) {
                navigate('/');
            }
        }
    }, [currencies, from, loading, navigate]);

    return (
        <div className={st.update}>
            <h3>Обновить курс валюты</h3>
            <form onSubmit={handleSubmit}>
                <div className={st.boxInput}>
                    <div>
                        <p>Код валюты</p>
                        <p>{from}</p>
                    </div>
                </div>
                <div className={st.boxInput}>
                    <Input
                        label="Цена покупки" 
                        type="number"
                        step="0.1"
                        value={formData.buyPrice} 
                        onChange={e => setFormData({...formData, buyPrice: e.target.value})} 
                    />
                    <Input 
                        label="Цена продажи" 
                        type="number"
                        step="0.1"
                        value={formData.sellPrice} 
                        onChange={e => setFormData({...formData, sellPrice: e.target.value})} 
                    />
                </div>

                <Button type="submit">
                   {loading ? 'Сохранение...' : 'Обновить курс'}
                </Button>
            </form>
            {message && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green', marginTop: '10px' }}>
                    {message.text}
                </p>
            )}
        </div>
    )
};

export default UpdateRate;
