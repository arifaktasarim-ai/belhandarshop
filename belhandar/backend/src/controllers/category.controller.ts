// Kategori yönetimi

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

function slugify(text: string) {
  return text
    .toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// GET /api/categories - Herkese açık
export async function getCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
}

// POST /api/admin/categories
export async function createCategory(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Kategori adı zorunludur.' });

  const category = await prisma.category.create({
    data: { name, slug: slugify(name) },
  });
  res.status(201).json(category);
}

// PUT /api/admin/categories/:id
export async function updateCategory(req: Request, res: Response) {
  const { name } = req.body;
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name, slug: name ? slugify(name) : undefined },
  });
  res.json(category);
}

// DELETE /api/admin/categories/:id
export async function deleteCategory(req: Request, res: Response) {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ message: 'Kategori silindi.' });
}
