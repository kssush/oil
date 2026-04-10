import React, { useEffect, useState } from "react";
import st from "./CashBox.module.scss";
import api from '../../api';
import Button from "../../components/button/Button";
import Input from "../../components/Input/Input";

const CashBox = () => {
    const [balances, setBalances] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    const fetchBalances = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cashbox');
            setBalances(res.data);

            if (!selectedCurrency && res.data.length > 0) {
                setSelectedCurrency(res.data[0].currency_code);
            }
        } catch (err) {
            console.error("Ошибка загрузки", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBalances(); }, []);

    const currentData = balances.find(b => b.currency_code === selectedCurrency);

    const handleDeposit = async () => {
        if (!amount) return alert("Введите сумму");

        try {
            await api.post("/issueCash", {adminId: userId, currency: selectedCurrency, amount: parseFloat(amount),});
            alert("Касса успешно пополнена!");
            setAmount("");
            fetchBalances();
        } catch (err) {
            alert(err.response?.data?.error || "Ошибка сервера");
        }
    };

    if (loading) return <div className={st.info}>Загрузка...</div>;

    return (
        <div className={st.cashBox}>
            <h2>Управление кассой</h2>
            
            <div className={st.panel}>
                <div className={st.row}>
                    <label>Выберите валюту:</label>
                    <select 
                        value={selectedCurrency} 
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className={st.select}
                    >
                        {balances.map(b => (
                            <option key={b.currency_code} value={b.currency_code}>
                                {b.currency_code} (Остаток: {parseFloat(b.amount).toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>

                {currentData && (
                    <div className={st.infoBlock}>
                        <div className={st.stat}>
                            <span>Текущий остаток:</span>
                            <strong>{parseFloat(currentData.amount).toLocaleString()} {currentData.currency_code}</strong>
                        </div>
                        {currentData.last_admin_deposit_at && (
                            <div className={st.stat}>
                                <span>Последнее пополнение:</span>
                                <em className={
                                    new Date(currentData.last_admin_deposit_at).toDateString() === new Date().toDateString() 
                                    ? st.todayHighlight : ""
                                }>
                                    {new Date(currentData.last_admin_deposit_at).toLocaleString('ru-RU')}
                                </em>
                            </div>
                        )}
                    </div>
                )}

                <div className={st.actionRow}>
                    <Input 
                        label="Сумма к выдаче..." 
                        type="number"
                        step="0.1"
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        required 
                    />
                    <Button onClick={handleDeposit}>Выдать деньги в кассу</Button>
                </div>
            </div>
        </div>
    );
};

export default CashBox;