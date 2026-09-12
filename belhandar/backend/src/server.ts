// Belhandar Backend - Ana Sunucu Giriş Noktası

import 'express-async-errors'; // async route hatalarını otomatik yakalar
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import { publicProductRouter, adminProductRouter } from './routes/product.routes';
import { publicCategoryRouter, adminCategoryRouter } from './routes/category.routes';
import stockRoutes from './routes/stock.routes';
import dashboardRoutes from './routes/dashboard.routes';
import reportRoutes from './routes/report.routes';
import { publicSettingsRouter, adminSettingsRouter } from './routes/settings.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
// Render.com kendi PORT değerini enjekte eder, bu değer görmezden gelinmemeli
const PORT = process.env.PORT || 5000;

// CLIENT_URL virgülle ayrılmış birden fazla adres içerebilir
// (örn. hem Render frontend adresi hem de kendi alan adınız)
const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((o) => o.trim());

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS tarafından engellendi: ' + origin));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sağlık kontrolü (Render.com health check bu uç noktaları kullanabilir)
app.get('/', (req, res) => res.json({ status: 'ok', app: 'Belhandar API' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Belhandar API' }));

// --- Herkese açık route'lar ---
app.use('/api/auth', authRoutes);
app.use('/api/products', publicProductRouter);
app.use('/api/categories', publicCategoryRouter);
app.use('/api/settings', publicSettingsRouter);

// --- Admin route'ları ---
app.use('/api/admin/products', adminProductRouter);
app.use('/api/admin/categories', adminCategoryRouter);
app.use('/api/admin/stock', stockRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/reports', reportRoutes);
app.use('/api/admin/settings', adminSettingsRouter);

// 404 yakalayıcı
app.use((req, res) => res.status(404).json({ message: 'Endpoint bulunamadı.' }));

// Merkezi hata yakalayıcı (en sonda olmalı)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Belhandar API http://localhost:${PORT} adresinde çalışıyor`);
});
