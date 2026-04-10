import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import './Header.module.scss';

const Header = () => {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            if (userId) {
                await api.post('/logout', { userId: userId });
            }
        } catch (err) {
            console.error("Ошибка при выходе из системы:", err);
        } finally {
            localStorage.clear();
            navigate('/login');
            window.location.reload();
        }
    };


    if(!userId) return <header>
        <p>Admin (login/password: admin) Operator1 (login/password: operator1)</p>
    </header>

    return(
        <header>
            <Link to='/'>Домашняя</Link>
            <Link to='/historyRate'>История валют</Link>
            {role !== 'admin' && (
                <>
                    <Link to='/exchange'>Обмен</Link>
                    <Link to='/action'>Действия</Link>
                </>
            )}
            
            {role === 'admin' && (
                <>
                    <Link to='/addRate'>Добавить курс</Link>
                    <Link to='/report'>Отчет</Link>
                    <Link to='/cashbox'>Касса</Link>
                    <Link to='/operators'>Операторы</Link>
                    <Link to='/register'>Регистрация</Link>
                </>
            )}
            <Link to='/login' onClick={handleLogout}>
                Выход
            </Link>
        </header>
    )
};

export default Header;
