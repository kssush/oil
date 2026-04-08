import React, { useEffect, useState } from "react";
import st from "./Exchange.module.scss";
import api from '../../api'; 
import Button from "../../components/button/Button";
import Input from "../../components/Input/Input";

const Exchange = () => {
    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        currencyCode: 'USD',
        baseCurrency: 'BYN', 
        amount: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const payload = {
            userId: userId,
            fromCurrency: formData.currencyCode,
            toCurrency: formData.baseCurrency,
            amount: parseFloat(formData.amount), 
        };

        try {
            await api.post('/exchange', payload);

            setMessage({ type: 'success', text: 'Обмен успещно произведен' });
            
            setFormData({ currencyCode: '', baseCurrency: '', amount: '', });

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

    return (
        <div className={st.excahnge}>
            <h3>Обмен валюты</h3>
            <form onSubmit={handleSubmit}>
                <div className={st.boxInput}>
                    <Input
                        id="1"
                        label="Код валюты 1 (напр. USD)" 
                        value={formData.currencyCode} 
                        onChange={e => setFormData({...formData, currencyCode: e.target.value.toUpperCase()})} 
                        placeholder="USD"
                        required 
                    />
                    <Input
                        id="2"
                        label="Код валюты 2 (напр. BYN)" 
                        value={formData.baseCurrency} 
                        onChange={e => setFormData({...formData, baseCurrency: e.target.value.toUpperCase()})} 
                        placeholder="BYN"
                        required 
                    />
                </div>
                <div className={st.boxInput}>
                    <Input
                        label="Сколько валюты 1 обменять" 
                        type="number"
                        step="0.1"
                        value={formData.amount} 
                        onChange={e => setFormData({...formData, amount: e.target.value})} 
                    />
                </div>

                <Button type="submit">
                   {loading ? 'Сохранение...' : 'Обменять'}
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

export default Exchange;
