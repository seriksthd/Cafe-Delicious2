# Cafe Delicious - Кафе заказ берүү системасы

## Системанын сүрөттөмөсү

Cafe Delicious - бул кыргыз тилинде жасалган заманбап кафе заказ берүү системасы. Система FastAPI, React, Redux Toolkit жана MongoDB колдонуп жасалган.

## Функциялар

### Кардарлар үчүн:
- 🏠 Кафе жөнүндө маалымат
- 📱 Кыргыз тилиндеги интерфейс
- 🛒 Себетке продукттарды кошуу
- 📞 Заказ берүү
- 🔍 Меню издөө жана фильтрация

### Админдер үчүн:
- 👨‍💼 Админ панели
- 📊 Dashboard статистика
- 🍕 Продукт башкаруу (кошуу, өзгөртүү, өчүрүү)  
- 📋 Заказ башкаруу (статус өзгөртүү)
- 💰 Киреше тарыхы

## Технологиялар

### Backend:
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL маалымат базасы  
- **Motor** - MongoDB async driver
- **JWT** - Админ аутентификациясы
- **BCrypt** - Пароль хэшери

### Frontend:
- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router** - Навигация
- **Axios** - HTTP client
- **Tailwind CSS** - CSS framework
- **Shadcn/UI** - UI компоненттери
- **Lucide React** - Иконкалар

## Орнотуу жана иштетүү

### 1. Репозиторийди клондоо
```bash
git clone <repository-url>
cd cafe-delicious
```

### 2. Backend орнотуу
```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend орнотуу  
```bash
cd frontend
yarn install
```

### 4. Environment файлдарды конфигурациялоо

**Backend (.env):**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="cafe_delicious"
```

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 5. Системаны иштетүү

**Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend:**
```bash
cd frontend  
yarn start
```

## Vercel Deployment

### 1. Vercel CLI орнотуу
```bash
npm i -g vercel
```

### 2. Environment variables орнотуу
```bash
vercel env add MONGO_URL
vercel env add DB_NAME
```

### 3. Deploy кылуу
```bash
vercel --prod
```

## API Endpoints

### Public Endpoints:
- `GET /api/` - API root
- `GET /api/products` - Продукттарды алуу
- `POST /api/orders` - Заказ берүү

### Admin Endpoints (Token керек):
- `POST /api/admin/login` - Админ логин
- `GET /api/admin/verify` - Токен текшерүү
- `GET /api/admin/dashboard` - Dashboard статистика
- `POST /api/products` - Продукт кошуу
- `PUT /api/products/{id}` - Продукт өзгөртүү
- `DELETE /api/products/{id}` - Продукт өчүрүү
- `GET /api/orders` - Активдүү заказдар
- `PUT /api/orders/{id}/status` - Заказ статусун өзгөртүү

## Тест маалыматтары

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## Проект структурасы

```
/
├── backend/
│   ├── server.py          # FastAPI колдонмосу
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Backend environment
├── frontend/
│   ├── src/
│   │   ├── components/    # React компоненттери
│   │   ├── pages/        # Баракчалар
│   │   ├── store/        # Redux store жана slice'тар
│   │   └── services/     # API service
│   ├── package.json      # Node dependencies
│   └── .env             # Frontend environment
├── vercel.json          # Vercel конфигурация
└── README.md           # Бул файл
```

## Өзгөчөлүктөр

- 🌍 Толугу менен кыргыз тилинде
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Современный UI/UX дизайн
- ⚡ Тез жана реактивдүү
- 🔒 Коопсуз админ панели
- 💳 Сом валютасы колдоосу

## Лицензия

MIT License

## Колдоо

Суроолор үчүн: [support@cafedelicious.kg](mailto:support@cafedelicious.kg)