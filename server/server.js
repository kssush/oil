const express = require('express');
const db = require('./db');
const dotenv = require('dotenv'); 
dotenv.config(); 
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/currencies', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM get_currency()');
        res.status(200).json(result.rows); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/current_rates', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM get_current_rates()');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/api/rates', async (req, res) => {
    const { userId, currencyCode, buyPrice, sellPrice } = req.body;
    
    try {
        await db.query(
            'CALL add_new_rate($1, $2, $3, $4)',
            [userId, currencyCode, buyPrice, sellPrice]
        );
        res.status(201).json({ success: true, message: 'Новый курс успешно добавлен' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/rates', async (req, res) => {
    const { userId, currencyCode, buyPrice, sellPrice } = req.body;
    console.log(userId, currencyCode, buyPrice, sellPrice)
    try {
        await db.query(
            'CALL update_rate($1, $2, $3, $4)',
            [userId, currencyCode, buyPrice, sellPrice]
        );
        res.status(200).json({ success: true, message: 'Курс успешно обновлен' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/api/exchange', async (req, res) => {
    const { userId, fromCurrency, toCurrency, amount } = req.body;

    try {
        await db.query(
            'CALL set_exchange($1, $2, $3, $4)', 
            [userId, fromCurrency, toCurrency, amount]
        );
        res.status(200).json({ success: true, message: 'Обмен успешно проведен' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/api/actions', async (req, res) => {
    const { userId } = req.query; 
    try {
        const result = await db.query(
            'SELECT * FROM action_session($1)',
            [userId]
        );
        console.log(result.rows)
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/api/history', async (req, res) => {
    const { currencyCode } = req.query;
    
    try {
        const result = await db.query(
            'SELECT * FROM get_select_rates($1)',
            [currencyCode]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/api/reports', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM get_admin_report()');
        res.status(200).json(result.rows); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/api/login', async (req, res) => {
    const { login, password} = req.body;

    try {
        await db.query('CALL log_in($1, $2)', [login, password]);

        const userResult = await db.query(
            'SELECT id, login, full_name, role FROM users WHERE login = $1', 
            [login]
        );

        const user = userResult.rows[0];
        res.status(200).json({message: "Вход выполнен успешно",user: user});
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

app.post('/api/logout', async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ error: "ID пользователя не указан" });
        }

        await db.query('CALL log_out($1)', [userId]);

        res.status(200).json({ message: "Сессия завершена" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => console.log(`Сервер запущен на порту ${process.env.PORT}`));