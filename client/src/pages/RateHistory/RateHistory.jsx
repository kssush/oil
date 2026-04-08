import React, { useEffect, useState } from "react";
import st from "./RateHistory.module.scss";
import api from '../../api';

const RateHistory = () => {
    const [currencies, setCurrencies] = useState([]); // Для списка в селекте
    const [selectedCurr, setSelectedCurr] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // список валют для выбора
    useEffect(() => {
        api.get('/currencies').then(res => {
            const filteredCurrencies = res.data.filter(curr => curr.code !== 'RUB');
            setCurrencies(filteredCurrencies);
            
            if (filteredCurrencies.length > 0) {
                setSelectedCurr(filteredCurrencies[0].code);
            }
        });
    }, []);

    // историю при смене валюты
    useEffect(() => {
        if (!selectedCurr) return;
        
        setLoading(true);
        api.get(`/history?currencyCode=${selectedCurr}`)
            .then(res => setHistory(res.data))
            .finally(() => setLoading(false));
    }, [selectedCurr]);

    const formatFullDate = (iso) => {
        const date = new Date(iso);
        return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className={st.history}>
            <h2>История курса {selectedCurr}</h2>
            
            <div className={st.controls}>
                <label>Выберите валюту: </label>
                <select value={selectedCurr} onChange={e => setSelectedCurr(e.target.value)}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div>Загрузка истории...</div>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Дата и время</th>
                            <th>Покупка (RUB)</th>
                            <th>Продажа (RUB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td className={st.dateColumn}>{formatFullDate(item.res_created)}</td>
                                <td className={st.valIn}>{parseFloat(item.res_buy).toFixed(4)}</td>
                                <td className={st.valOut}>{parseFloat(item.res_sell).toFixed(4)}</td>
                            </tr>
                        ))}
                        {history?.length === 0 && <p>Курс еще не добавлен!</p>}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RateHistory;