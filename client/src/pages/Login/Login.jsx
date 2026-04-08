import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import st from "./Login.module.scss";
import api from "../../api";
import Button from "../../components/button/Button";
import Input from '../../components/Input/Input';

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post("/login", {
                login: login,
                password: password
            });

            if (response.data.user) {
                localStorage.setItem("userId", response.data.user.id);
                localStorage.setItem("userRole", response.data.user.role);
                localStorage.setItem("userName", response.data.user.full_name);

                navigate("/");
                window.location.reload(); 
            }
        } catch (err) {
            setError(err.response?.data?.error || "Ошибка авторизации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={st.login}>
            <h2>Авторизация</h2>
            <form onSubmit={handleLogin}>
                <div className={st.boxInput}>
                    <Input 
                        id="login"
                        label="login"
                        type="text" 
                        value={login} 
                        onChange={(e) => setLogin(e.target.value)} 
                        required 
                    />
                    <Input
                        id="password"
                        label="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Загрузка...' : 'Авторизоваться'}
                </Button>
            </form>
            {error && (
                <p  >
                    {error}
                </p>
            )}
        </div>
    );
};

export default Login;