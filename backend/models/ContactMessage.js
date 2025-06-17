// models/ContactMessage.js

const mongoose = require('mongoose');

// Определяем схему для сообщений из формы контактов
const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Поле "name" обязательно
        trim: true      // Удаляем пробелы в начале и конце строки
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Преобразуем email в нижний регистр
        match: /^\S+@\S+\.\S+$/ // Простая валидация формата email
    },
    serviceType: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Автоматически устанавливаем текущую дату создания
    }
});

// Создаем модель на основе схемы
// 'ContactMessage' станет именем коллекции в MongoDB (будет преобразовано в 'contactmessages')
module.exports = mongoose.model('ContactMessage', contactMessageSchema);