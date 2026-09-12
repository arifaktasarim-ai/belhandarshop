import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth.middleware';

export const publicSettingsRouter = Router();
publicSettingsRouter.get('/', async (req: Request, res: Response) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) settings = await prisma.settings.create({ data: { siteName: 'Belhandar' } });
  res.json(settings);
});

export const adminSettingsRouter = Router();
adminSettingsRouter.use(authenticate, authorize('ADMIN'));
adminSettingsRouter.put('/', async (req: Request, res: Response) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) settings = await prisma.settings.create({ data: req.body });
  else settings = await prisma.settings.update({ where: { id: settings.id }, data: req.body });
  res.json(settings);
});
