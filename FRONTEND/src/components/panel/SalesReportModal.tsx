import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import { useToast } from "../../contexts/useToastContext";

interface ReportRow {
  producto_id: number;
  producto_nombre: string;
  total_cantidad: number;
  total_revenue: number;
}

interface Props {
  onClose: () => void;
  date?: string; // YYYY-MM-DD
}

const SalesReportModal: React.FC<Props> = ({ onClose, date }) => {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const url = `http://localhost:8000/ventas/daily_report${date ? `?date=${date}` : ""}`;
        const res = await axios.get<ReportRow[]>(url);
        setRows(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [date]);

  const downloadCSV = () => {
    const header = ["producto_id", "producto_nombre", "total_cantidad", "total_revenue"];
    const lines = [header.join(",")];
    rows.forEach(r => {
      lines.push([r.producto_id, `"${r.producto_nombre.replace(/"/g, '""')}"`, r.total_cantidad, r.total_revenue].join(","));
    });
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${date || new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo (usando ruta pública)
    const img = new Image();
    img.src = '/logo.png';

    const title = `Reporte de ventas ${date || '(hoy)'}`;
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);

      // Título
      doc.setFontSize(20);
      doc.setTextColor('#1f618d');
      doc.text(title, 140, 50);

      // Subtítulo con timestamp
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(`Generado: ${generatedAtStr}`, 140, 68);

      // Mensaje motivacional
      doc.setFontSize(11);
      doc.setTextColor('#222');
      const mensaje = `Gracias por tu trabajo incansable. Este reporte muestra las ventas registradas para la fecha seleccionada. Mantener un control diario ayuda a tomar decisiones informadas y a optimizar inventarios. ¡Sigue así!`;
      const mensajeLines = doc.splitTextToSize(mensaje, pageWidth - 80);
      doc.text(mensajeLines, 40, 110);

      // Tabla
      const startY = 140 + mensajeLines.length * 12;
      const head = [["Producto", "Cantidad", "Ingresos (S/.)"]];
      const body = rows.map(r => [r.producto_nombre, r.total_cantidad, Number(r.total_revenue).toFixed(2)]);

      autoTable(doc, {
        head,
        body,
        startY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: '#27ae60', textColor: '#fff' },
        columnStyles: {
          1: { halign: 'center', cellWidth: 80 },
          2: { halign: 'right', cellWidth: 100 }
        },
        margin: { left: 40, right: 40 }
      });

      // Totales
      const totalCantidad = rows.reduce((s, r) => s + Number(r.total_cantidad), 0);
      const totalRevenue = rows.reduce((s, r) => s + Number(r.total_revenue), 0);
  // Obtener posición final de la tabla si está disponible (autotable añade lastAutoTable)
  const maybeLast = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  const afterTableY = maybeLast ? maybeLast.finalY + 20 : startY + body.length * 20;
      doc.setFontSize(11);
      doc.setTextColor('#000');
      doc.text(`Total unidades vendidas: ${totalCantidad}`, 40, afterTableY);
      doc.text(`Total ingresos: S/. ${totalRevenue.toFixed(2)}`, pageWidth - 220, afterTableY, { align: 'left' });

      // Pie con fecha de última vista
      doc.setFontSize(9);
      doc.setTextColor('#777');
      doc.text(`Última vista: ${generatedAtStr}`, 40, doc.internal.pageSize.getHeight() - 30);

      // Guardar
      doc.save(`ventas_${date || new Date().toISOString().slice(0,10)}.pdf`);
    };
  };

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ventas');

      // Añadir encabezados con estilo
      worksheet.addRow(['ID', 'Producto', 'Cantidad', 'Ingresos (S/.)']).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '27AE60' }
        };
        cell.alignment = { horizontal: 'center' };
      });

      // Añadir datos
      rows.forEach(r => {
        worksheet.addRow([
          r.producto_id,
          r.producto_nombre,
          r.total_cantidad,
          Number(r.total_revenue).toFixed(2)
        ]);
      });

      // Ajustar ancho de columnas
      worksheet.columns.forEach(column => {
        column.width = 20;
      });

      // Añadir totales
      const totalRow = worksheet.addRow([
        'TOTAL',
        '',
        rows.reduce((s, r) => s + r.total_cantidad, 0),
        Number(rows.reduce((s, r) => s + r.total_revenue, 0)).toFixed(2)
      ]);
      totalRow.font = { bold: true };

      // Guardar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ventas_${date || new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando Excel:', err);
      showToast('No se pudo generar el Excel. Asegúrate de haber instalado la dependencia xlsx.', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 800 }}>
        <h2>Reporte de ventas {date || "(hoy)"}</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button className="btn-save" onClick={downloadCSV} disabled={rows.length === 0}>Descargar CSV</button>
          <button className="btn-save" onClick={downloadPDF} disabled={rows.length === 0}>Descargar PDF</button>
          <button className="btn-save" onClick={downloadExcel} disabled={rows.length === 0}>Descargar Excel</button>
          <button className="btn-delete" onClick={onClose}>Cerrar</button>
        </div>
        {loading ? <p>Cargando...</p> : (
          rows.length === 0 ? <p>No hay ventas para la fecha seleccionada.</p> : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.producto_id}>
                    <td>{r.producto_nombre}</td>
                    <td>{r.total_cantidad}</td>
                    <td>{r.total_revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default SalesReportModal;
