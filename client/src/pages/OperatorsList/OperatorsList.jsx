import React, { useEffect, useState } from "react";
import st from "./OperatorsList.module.scss";
import api from "../../api";
import Button from "../../components/button/Button";

const OperatorsList = () => {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(false);

    const adminId = localStorage.getItem("userId");

    const fetchOperators = async () => {
        try {
            setLoading(true);
            const res = await api.get("/operators");
            setOperators(res.data);
        } catch (err) {
            console.error("Ошибка загрузки", err);
        } finally {
            setLoading(false);
        }
    };

    console.log(operators)

    useEffect(() => { fetchOperators(); }, []);

    const handleToggle = async (operator) => {
        const isPlug = operator.deleted_at !== null;

        try {
            await api.post("/userPlug", { 
                adminId: adminId, 
                userId: operator.id, 
                isPlug: isPlug 
            });
            
            setOperators(prev => 
                prev.map(op => 
                    op.id === operator.id 
                    ? { ...op, deleted_at: isPlug ? null : new Date().toISOString() } 
                    : op
                )
            );
        } catch (err) {
            alert(err.response?.data?.error || "Ошибка смены статуса");
        }
    };

    if (loading && operators.length === 0) return <div className={st.info}>Загрузка...</div>;

    return (
        <div className={st.operatorsPage}>
            <div className={st.header}>
                <h2>Управление доступом</h2>
                <Button onClick={fetchOperators}>Обновить</Button>
            </div>

            <div className={st.list}>
                {operators.map((op) => {
                    const isActive = op.deleted_at === null;
                    return (
                        <div key={op.id} className={`${st.operatorCard} ${!isActive ? st.disabled : ""}`}>
                            <div className={st.info}>
                                <span className={st.name}>{op.full_name}</span>
                                <span className={st.login}>@{op.login}</span>
                                <div className={`${st.status} ${isActive ? st.activeText : st.inactiveText}`}>
                                    {isActive ? "● В системе" : "○ Доступ закрыт"}
                                </div>
                            </div>
                            
                            <div className={st.actions}>
                                <Button 
                                    onClick={() => handleToggle(op)}
                                    className={isActive ? st.btnDisable : st.btnEnable}
                                >
                                    {isActive ? "Отключить" : "Подключить"}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OperatorsList;