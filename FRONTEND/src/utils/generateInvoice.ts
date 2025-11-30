import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PedidoInfo = {
  id_pedido: number;
  fecha_pedido?: string;
  estado?: string;
  total?: number;
  cliente?: { nombre?: string; email?: string };
};

type Detalle = {
  producto_id?: number;
  descripcion?: string;
  cantidad: number;
  precio_unitario: number;
};

type CompanyInfo = {
  nombre?: string;
  nit?: string;
  direccion?: string;
  telefono?: string;
  logoBase64?: string; // optional base64 image
};

/**
 * Generate an A4 invoice PDF with a polished layout (header, company, table, totals, footer).
 */
export function generateInvoiceA4(pedido: PedidoInfo, detalles: Detalle[], company: CompanyInfo = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  // Header: optional logo at left
  const leftMargin = 48;
  if (company.logoBase64) {
    try {
      doc.addImage(company.logoBase64, 'PNG', leftMargin, 24, 80, 40);
    } catch (e) {
      // ignore image errors
    }
  }

  // Title centered
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA ELECTRÓNICA', pageWidth / 2, y, { align: 'center' });
  y += 28;

  // Company info left, invoice metadata right
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const metaLeftX = leftMargin;
  const metaRightX = pageWidth - 200;

  // Company block
  const companyName = company.nombre || 'JOSNISHOP';
  doc.text(companyName, metaLeftX, y);
  if (company.nit) doc.text(`NIT: ${company.nit}`, metaLeftX, y + 14);
  if (company.direccion) doc.text(company.direccion, metaLeftX, y + 28);
  if (company.telefono) doc.text(`Tel: ${company.telefono}`, metaLeftX, y + 42);

  // Invoice meta
  doc.text(`Número: ${pedido.id_pedido}`, metaRightX, y);
  const fechaText = pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleString() : '';
  doc.text(`Fecha: ${fechaText}`, metaRightX, y + 14);
  if (pedido.cliente?.nombre) doc.text(`Cliente: ${pedido.cliente.nombre}`, metaLeftX, y + 56);
  if (pedido.cliente?.email) doc.text(`Email: ${pedido.cliente.email}`, metaLeftX + 250, y + 56);

  y += 70;

  // Table of items
  const tableColumns = [
    { header: 'Cant', dataKey: 'cantidad' },
    { header: 'Descripción', dataKey: 'descripcion' },
    { header: 'Precio', dataKey: 'precio' },
    { header: 'Subtotal', dataKey: 'subtotal' },
  ];

  const body = detalles.map((d) => ({
    cantidad: d.cantidad,
    descripcion: d.descripcion || (d.producto_id ? `Producto #${d.producto_id}` : ''),
    precio: Number(d.precio_unitario).toFixed(2),
    subtotal: (d.cantidad * Number(d.precio_unitario)).toFixed(2),
  }));

  (autoTable as any)(doc, {
    startY: y,
    head: [tableColumns.map((c) => c.header)],
    body: body.map((r) => [r.cantidad, r.descripcion, r.precio, r.subtotal]),
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [240, 240, 240], textColor: [34, 34, 34], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 280 }, 2: { cellWidth: 80 }, 3: { cellWidth: 80 } },
    margin: { left: leftMargin, right: leftMargin },
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable?.finalY || y + 120;

  // Totals block aligned to right
  const total = pedido.total ?? detalles.reduce((s, it) => s + it.cantidad * Number(it.precio_unitario), 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - leftMargin - 120, finalY + 30);
  doc.text(Number(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), pageWidth - leftMargin - 20, finalY + 30, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Software JosniShop - Gracias por su compra', leftMargin, doc.internal.pageSize.getHeight() - 40);

  const filename = `factura_${pedido.id_pedido}.pdf`;
  doc.save(filename);
}

export default generateInvoiceA4;
