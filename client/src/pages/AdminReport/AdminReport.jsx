import React, { useEffect, useState } from "react";
import st from "./AdminReport.module.scss";
import api from '../../api';
import Button from "../../components/button/Button";

const AdminReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports'); // Предполагаем такой роут в Express
            setReportData(res.data);
            setError(null);
        } catch (err) {
            setError("Не удалось загрузить отчет");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('ru-RU');
    };

    if (loading) return <div className={st.info}>Генерация отчета...</div>;

    return (
        <div className={st.adminReport}>
            <div className={st.header}>
                <h2>Отчет по операциям</h2>
                <Button onClick={fetchReport}>Обновить отчет</Button>
            </div>

            {error && <div className={st.error}>{error}</div>}

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Направление</th>
                        <th>Отдали (Всего)</th>
                        <th>Получили (Всего)</th>
                        <th>Сделок</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.length > 0 ? (
                        reportData.map((row, index) => (
                            <tr key={index}>
                                <td className={st.dateCell}>{formatDate(row.report_date)}</td>
                                <td className={st.pairCell}>
                                    <strong>{row.currency_from}</strong> -&gt; <strong>{row.currency_to}</strong>
                                </td>
                                <td className={st.valFrom}>
                                    {parseFloat(row.total_from).toFixed(2)} {row.currency_from}
                                </td>
                                <td className={st.valTo}>
                                    {parseFloat(row.total_to).toFixed(2)} {row.currency_to}
                                </td>
                                <td className={st.countCell}>{row.operations_count}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Данных за отчетный период нет</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminReport;