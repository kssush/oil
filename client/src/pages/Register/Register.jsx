import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import st from "./Register.module.scss"; 
import api from "../../api";
import Button from "../../components/button/Button";
import Input from '../../components/Input/Input';

const Register = () => {
    const [formData, setFormData] = useState({
        login: "",
        password: "",
        fullName: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post("/register", {
                Regid: userId,
                login: formData.login,
                password: formData.password,
                fullName: formData.fullName
            });

            if (response.status === 201 || response.data.success) {
                alert("Регистрация успешна!");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Ошибка при регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={st.login}> 
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <div className={st.boxInput}>
                    <Input 
                        id="fullName"
                        label="ФИО"
                        type="text" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input 
                        id="login"
                        label="Логин"
                        type="text" 
                        value={formData.login} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input
                        id="password"
                        label="Пароль"
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
                </Button>
            </form>

            {error && <p className={st.errorText}>{error}</p>}
{/*             
            <p className={st.switchPage}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p> */}
        </div>
    );
};

export default Register;