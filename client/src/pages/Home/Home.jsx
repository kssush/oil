import React, { useEffect, useState } from "react";
import st from "./Home.module.scss";
import api from '../../api';
import Button from "../../components/button/Button";
import { useNavigate  } from "react-router-dom";

const Home = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchRates = async () => {
        try {
            setLoading(true);
        
            const response = await api.get('/current_rates');  

            setRates(response.data); 
            setError(null);
        } catch (err) {
            console.error("Ошибка при загрузке курсов:", err);
            setError("Не удалось загрузить курсы валют");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleClick = (from) => {
        navigate(`/updateRate/${from}`); 
    };

    if (loading) return <div>Загрузка актуальных курсов...</div>;
    if (error) return <div className={st.error}>{error}</div>;

    return (
        <div className={st.home}>
            <h2>Текущие курсы валют</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Валюта</th>
                        <th>Покупка</th>
                        <th>Продажа</th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map((rate, index) => (
                        <tr key={index} onClick={() => handleClick(rate.currency_code)}>
                            <td>{rate.currency_code}</td>
                            <td>{parseFloat(rate.buy_price).toFixed(3)}</td>
                            <td>{parseFloat(rate.sell_price).toFixed(3)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button onClick={fetchRates}> 
                Обновить валюту
            </Button>
        </div>
    );
};

export default Home;
