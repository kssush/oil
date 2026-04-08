import React, { useEffect, useState } from "react";
import st from "./Actions.module.scss";
import api from '../../api'; 

const Actions = ({ userId = 2 }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        const fetchAction = async () => {
            try {
                setLoading(true);
                const result = await api.get(`/actions?userId=${userId}`); 
                setActions(result.data); 
            } catch (err) {
                const errorText = err.response?.data?.error || "Ошибка соединения";
                setMessage({ type: 'error', text: errorText });
            } finally {
                setLoading(false);
            }
        };

        fetchAction();
    }, [userId]);

    // Функция для красивой даты: 08.04.2026 21:09
    const formatFullDate = (iso) => {
        const date = new Date(iso);
        return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    };

    if (loading) return <div>Загрузка истории сессии...</div>;
    if (message) return <div className={st.error}>{message.text}</div>;

    return (
        <div className={st.actions}>
            <h2>Последние операции в сессии</h2>
            
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Дата и время</th>
                        <th>Отдал</th>
                        <th>Получил</th>
                        <th>Курс</th>
                    </tr>
                </thead>
                <tbody>
                    {actions.length > 0 ? (
                        actions.map((item, index) => {
                            const rate = (parseFloat(item.amount_out) / parseFloat(item.amount_in)).toFixed(4);
                            return (
                                <tr key={index}>
                                    <td className={st.dateColumn}>{formatFullDate(item.op_time)}</td>
                                    <td>
                                        <span className={st.valIn}>{parseFloat(item.amount_in).toFixed(2)} {item.from_curr}</span> 
                                    </td>
                                    <td>
                                        <span className={st.valOut}>{parseFloat(item.amount_out).toFixed(2)}  {item.to_curr}</span> 
                                       
                                    </td>
                                    <td className={st.rateColumn}>{rate}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Операций еще не было</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Actions;