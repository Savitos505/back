require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Добавьте эту строку для работы с путями
const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- НОВЫЙ КОД ДЛЯ ОТДАЧИ СТАТИЧЕСКИХ ФАЙЛОВ ---
// Указываем Express, где находятся статические файлы фронтенда
// path.join(__dirname, '..', 'frontend') создает путь типа 'C:\Users\user\Desktop\back\frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Подключено к MongoDB!'))
    .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Простой тестовый маршрут
app.get('/', (req, res) => {
    res.send('Бэкенд типографии "Профи" запущен!');
});

// --- НОВЫЙ МАРШРУТ ДЛЯ ФОРМЫ КОНТАКТОВ ---
app.post('/api/contact', async (req, res) => {
    try {
        // Получаем данные из тела запроса
        const { name, email, serviceType, message } = req.body;

        // Базовая валидация данных
        if (!name || !email || !serviceType || !message) {
            return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля.' });
        }

        // Создаем новый экземпляр сообщения на основе нашей модели
        const newContactMessage = new ContactMessage({
            name,
            email,
            serviceType,
            message
        });

        // Сохраняем сообщение в базу данных
        await newContactMessage.save();

        // Отправляем успешный ответ клиенту
        res.status(201).json({ message: 'Сообщение успешно отправлено!', data: newContactMessage });

    } catch (error) {
        // Обрабатываем ошибки (например, ошибки валидации Mongoose)
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Ошибка валидации формы.', errors });
        }
        console.error('Ошибка при сохранении сообщения:', error);
        res.status(500).json({ message: 'Произошла ошибка сервера при отправке сообщения.' });
    }
});
// --- КОНЕЦ НОВОГО МАРШРУТА ---


// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});