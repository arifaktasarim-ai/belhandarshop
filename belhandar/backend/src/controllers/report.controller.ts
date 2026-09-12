// Raporlar: PDF ve Excel çıktısı üretimi
// Stok raporu, kritik stok raporu, ürün listesi raporu

import { Response } from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

type ReportType = 'products' | 'stock' | 'critical';

async function getReportData(type: ReportType) {
  const products = await prisma.product.findMany({ include: { category: true } });
  if (type === 'critical') return products.filter((p) => p.stockQuantity <= p.criticalStock);
  return products;
}

function reportTitle(type: ReportType) {
  if (type === 'critical') return 'Kritik Stok Raporu';
  if (type === 'stock') return 'Stok Raporu';
  return 'Ürün Listesi Raporu';
}

// GET /api/admin/reports/:type/pdf
export async function generatePdfReport(req: AuthRequest, res: Response) {
  const type = req.params.type as ReportType;
  const products = await getReportData(type);
  const title = reportTitle(type);

  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="belhandar-${type}-raporu.pdf"`);
  doc.pipe(res);

  // Başlık
  doc.fontSize(20).fillColor('#0F0F0F').text('BELHANDAR', { align: 'center' });
  doc.fontSize(14).fillColor('#D4AF37').text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(9).fillColor('#555').text(`Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}`, { align: 'center' });
  doc.moveDown(1.5);

  // Tablo başlıkları
  const headers = ['Ürün Adı', 'Kod', 'Kategori', 'Hacim', 'Stok', 'Kritik Eşik', 'Durum'];
  const colWidths = [180, 80, 120, 60, 60, 80, 70];
  let y = doc.y;
  let x = 40;

  doc.fontSize(10).fillColor('#FFFFFF');
  doc.rect(40, y, colWidths.reduce((a, b) => a + b, 0), 20).fill('#0F0F0F');
  doc.fillColor('#D4AF37');
  headers.forEach((h, i) => {
    doc.text(h, x + 5, y + 5, { width: colWidths[i] - 10 });
    x += colWidths[i];
  });

  y += 20;
  doc.fillColor('#0F0F0F');

  products.forEach((p, idx) => {
    if (y > 500) { doc.addPage({ layout: 'landscape' }); y = 40; }
    x = 40;
    if (idx % 2 === 0) {
      doc.rect(40, y, colWidths.reduce((a, b) => a + b, 0), 18).fill('#F5F5F0');
      doc.fillColor('#0F0F0F');
    }
    const row = [
      p.name, p.code, p.category?.name || '-', `${p.volumeMl}ml`,
      String(p.stockQuantity), String(p.criticalStock), p.status,
    ];
    row.forEach((val, i) => {
      doc.fontSize(9).text(val, x + 5, y + 4, { width: colWidths[i] - 10 });
      x += colWidths[i];
    });
    y += 18;
  });

  doc.end();
}

// GET /api/admin/reports/:type/excel
export async function generateExcelReport(req: AuthRequest, res: Response) {
  const type = req.params.type as ReportType;
  const products = await getReportData(type);
  const title = reportTitle(type);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Belhandar';
  const sheet = workbook.addWorksheet(title);

  sheet.columns = [
    { header: 'Ürün Adı', key: 'name', width: 30 },
    { header: 'Ürün Kodu', key: 'code', width: 15 },
    { header: 'Barkod', key: 'barcode', width: 18 },
    { header: 'Kategori', key: 'category', width: 20 },
    { header: 'Cinsiyet', key: 'gender', width: 12 },
    { header: 'Hacim (ml)', key: 'volumeMl', width: 12 },
    { header: 'Stok Miktarı', key: 'stockQuantity', width: 14 },
    { header: 'Kritik Eşik', key: 'criticalStock', width: 12 },
    { header: 'Durum', key: 'status', width: 12 },
    { header: 'Oluşturma Tarihi', key: 'createdAt', width: 20 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFD4AF37' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F0F0F' } };
  });

  products.forEach((p) => {
    sheet.addRow({
      name: p.name,
      code: p.code,
      barcode: p.barcode || '-',
      category: p.category?.name || '-',
      gender: p.gender,
      volumeMl: p.volumeMl,
      stockQuantity: p.stockQuantity,
      criticalStock: p.criticalStock,
      status: p.status,
      createdAt: p.createdAt.toLocaleDateString('tr-TR'),
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="belhandar-${type}-raporu.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}
