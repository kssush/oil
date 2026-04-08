import React, { useEffect, useState } from 'react';
import st from './AddRate.module.scss';
import api from '../../api'; 
import Input from '../../components/Input/Input';
import Button from '../../components/button/Button';

const AddRate = ({ userId = 1}) => {
    const [formData, setFormData] = useState({
        currencyCode: '',
        buyPrice: '',
        sellPrice: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [currencies, setCurrencies] = useState(null);

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
            await api.post('/rates', payload);

            setMessage({ type: 'success', text: 'Курс успешно создан!' });
            
            setFormData({ currencyCode: '', buyPrice: '', sellPrice: '' });

        } catch (err) {
            const errorText = err.response?.data?.error || "Ошибка соединения";
            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={st.add}>
            <h3>Добавить новый курс валюты</h3>
            <form onSubmit={handleSubmit}>
                <div className={st.boxInput}>
                    <Input
                        id="cur"
                        label="Код валюты (напр. USD)" 
                        value={formData.currencyCode} 
                        onChange={e => setFormData({...formData, currencyCode: e.target.value.toUpperCase()})} 
                        placeholder="USD"
                        required 
                    />
                </div>
                <div className={st.boxInput}>
                    <Input 
                        label="Цена покупки" 
                        type="number"
                        step="0.1"
                        value={formData.buyPrice} 
                        onChange={e => setFormData({...formData, buyPrice: e.target.value})}
                        required 
                    />
                    <Input 
                        label="Цена продажи" 
                        type="number"
                        step="0.1"
                        value={formData.sellPrice} 
                        onChange={e => setFormData({...formData, sellPrice: e.target.value})} 
                        required
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Создать курс'}
                </Button>

                <div className={st.boxCur}>
                    <p>Имеющиеся валюты</p>
                    <div>
                        {currencies?.map(item => (
                            <p key={item.code}>
                                {item.code}
                            </p>
                        ))}
                    </div>
                </div>
            </form>
            {message && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green', marginTop: '10px' }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default AddRate;
