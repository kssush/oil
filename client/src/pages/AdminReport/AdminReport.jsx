// import React, { useEffect, useState } from "react";
// import st from "./AdminReport.module.scss";
// import api from '../../api';
// import Button from "../../components/button/Button";

// const AdminReport = () => {
//     const [reportData, setReportData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const fetchReport = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get('/reports'); // Предполагаем такой роут в Express
//             setReportData(res.data);
//             setError(null);
//         } catch (err) {
//             setError("Не удалось загрузить отчет");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchReport();
//     }, []);

//     const formatDate = (iso) => {
//         return new Date(iso).toLocaleDateString('ru-RU');
//     };

//     if (loading) return <div className={st.info}>Генерация отчета...</div>;

//     return (
//         <div className={st.adminReport}>
//             <div className={st.header}>
//                 <h2>Отчет по операциям</h2>
//                 <Button onClick={fetchReport}>Обновить отчет</Button>
//             </div>

//             {error && <div className={st.error}>{error}</div>}

//             <table border="1" cellPadding="10">
//                 <thead>
//                     <tr>
//                         <th>Дата</th>
//                         <th>Направление</th>
//                         <th>Отдали (Всего)</th>
//                         <th>Получили (Всего)</th>
//                         <th>Сделок</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reportData.length > 0 ? (
//                         reportData.map((row, index) => (
//                             <tr key={index}>
//                                 <td className={st.dateCell}>{formatDate(row.report_date)}</td>
//                                 <td className={st.pairCell}>
//                                     <strong>{row.currency_from}</strong> -&gt; <strong>{row.currency_to}</strong>
//                                 </td>
//                                 <td className={st.valFrom}>
//                                     {parseFloat(row.total_from).toFixed(2)} {row.currency_from}
//                                 </td>
//                                 <td className={st.valTo}>
//                                     {parseFloat(row.total_to).toFixed(2)} {row.currency_to}
//                                 </td>
//                                 <td className={st.countCell}>{row.operations_count}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5" style={{ textAlign: 'center' }}>Данных за отчетный период нет</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AdminReport;



import React, { useCallback, useEffect, useState } from "react";
import st from "./AdminReport.module.scss";
import api from '../../api';
import Button from "../../components/button/Button";

const AdminReport = () => {
    const [reportData, setReportData] = useState([]);
    const [reportType, setReportType] = useState("general"); // "general", "daily", "detailed"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            let endpoint = '';
            
            switch(reportType) {
                case "general": endpoint = '/reports'; break; 
                case "daily": endpoint = '/operatorsSummary'; break;
                case "detailed": endpoint = '/operatorsHistory'; break;
                default: endpoint = '/reports';
            }
            
            const res = await api.get(endpoint);
            setReportData(res.data);
            setError(null);
        } catch (err) {
            setError("Не удалось загрузить отчет");
        } finally {
            setLoading(false);
        }
    }, [reportType]); 

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const formatDate = (iso) => {
        const date = new Date(iso);
        return reportType === "detailed" ? date.toLocaleString('ru-RU') : date.toLocaleDateString('ru-RU');
    };

    return (
        <div className={st.adminReport}>
            <div className={st.header}>
                <div className={st.titleGroup}>
                    <h2>Отчетность</h2>
                    <select 
                        className={st.reportSelect}
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="general">Общий сводный (по валютам)</option>
                        <option value="daily">Сводный по операторам (за дни)</option>
                        <option value="detailed">Детальный (все операции)</option>
                    </select>
                </div>
                <Button onClick={fetchReport}>Обновить</Button>
            </div>

            {error && <div className={st.error}>{error}</div>}

            {loading ? (
                <div className={st.info}>Генерация отчета...</div>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            {reportType !== "general" && <th>Оператор</th>}
                            <th>Направление</th>
                            <th>{reportType === "detailed" ? "Отдал" : "Отдали (Всего)"}</th>
                            <th>{reportType === "detailed" ? "Получил" : "Получили (Всего)"}</th>
                            <th>{reportType === "detailed" ? "Курс" : "Сделок"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? (
                            reportData.map((row, index) => (
                                <tr key={index}>
                                    <td className={st.dateCell}>
                                        {formatDate(row.report_date || row.created_at)}
                                    </td> 
                                    {reportType !== "general" && (
                                        <td><strong>{row.operator_name}</strong></td>
                                    )}
                                    <td className={st.pairCell}>
                                        {row.currency_from || row.from_currency} → {row.currency_to || row.to_currency}
                                    </td>
                                    <td className={st.valFrom}>
                                        {parseFloat(row.total_from || row.total_from_amount || row.from_amount).toFixed(2)} {row.currency_from || row.from_currency}
                                    </td>
                                    <td className={st.valTo}>
                                        {parseFloat(row.total_to || row.total_to_amount || row.to_amount).toFixed(2)} {row.currency_to || row.to_currency}
                                    </td>
                                    <td className={st.countCell}>
                                        {row.operations_count || parseFloat(row.rate).toFixed(4)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={reportType === "general" ? "5" : "6"} style={{ textAlign: 'center' }}>
                                    Данных нет
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminReport;