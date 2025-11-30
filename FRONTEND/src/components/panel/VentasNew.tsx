import React, { useState, useMemo } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type QueryType = 'anio' | 'mes' | 'dia';

interface MesConVentas {
  mes: number;
  nombre: string;
  ventas: number;
  performance: 'bajo' | 'medio' | 'alto';
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const COLORES_PERFORMANCE = {
  bajo: '#ff6b6b',   // Rojo
  medio: '#ff9e64',  // Naranja
  alto: '#27ae60'    // Verde
};

const Ventas: React.FC = () => {
  const [ventasData, setVentasData] = useState<MesConVentas[]>([]);
  const [type, setType] = useState<QueryType>("anio");
  const [anio, setAnio] = useState<number>(2025);
  const [mes, setMes] = useState<number | null>(null);
  const [dia, setDia] = useState<number | null>(null);

  const consultarVentas = async () => {
    try {
      if (type === "anio") {
        // Consultar cada mes del año
        const promesas = MESES.map((_, index) => 
          axios.get(`http://localhost:8000/ventas?anio=${anio}&mes=${index + 1}`)
            .then(res => {
              const data = (res.data as any[])[0] as { TotalVentasMensuales?: number };
              return {
                mes: index + 1,
                nombre: MESES[index],
                ventas: data?.TotalVentasMensuales ?? 0,
                performance: 'medio' as const
              };
            })
            .catch(() => ({
              mes: index + 1,
              nombre: MESES[index],
              ventas: 0,
              performance: 'bajo' as const
            }))
        );
        
        const resultados = await Promise.all(promesas);
        
        // Calcular promedio para determinar si es alto, medio o bajo
        const ventasTotal = resultados.reduce((sum, m) => sum + m.ventas, 0);
        const promedio = ventasTotal / resultados.length;
        const umbralAlto = promedio * 1.3;
        const umbralMedio = promedio * 0.7;
        
        // Asignar performance basado en umbrales
        const datosConPerformance = resultados.map(mes => ({
          ...mes,
          performance: mes.ventas >= umbralAlto ? ('alto' as const) : mes.ventas >= umbralMedio ? ('medio' as const) : ('bajo' as const)
        }));
        
        setVentasData(datosConPerformance);
      } else if (type === "mes") {
        // Consultar un mes específico (días)
        const params = `?anio=${anio}&mes=${mes}`;
        const res = await axios.get(`http://localhost:8000/ventas${params}`);
        const data = (res.data as any[])[0] as { TotalVentasMensuales?: number };
        setVentasData([{
          mes: mes || 1,
          nombre: MESES[mes ? mes - 1 : 0],
          ventas: data?.TotalVentasMensuales ?? 0,
          performance: 'medio'
        }]);
      } else {
        // Consultar un día específico
        const params = `?anio=${anio}${mes ? `&mes=${mes}` : ''}${dia ? `&dia=${dia}` : ''}`;
        const res = await axios.get(`http://localhost:8000/ventas${params}`);
        const data = (res.data as any[])[0] as { TotalVentasDiarias?: number };
        setVentasData([{
          mes: 1,
          nombre: `Día ${dia || 1}`,
          ventas: data?.TotalVentasDiarias ?? 0,
          performance: 'medio'
        }]);
      }
    } catch (err) {
      console.error(err);
      setVentasData([]);
    }
  };

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    if (ventasData.length === 0) return null;
    
    const ventas = ventasData.map(m => m.ventas);
    const total = ventas.reduce((a, b) => a + b, 0);
    const promedio = total / ventas.length;
    const max = Math.max(...ventas);
    const min = Math.min(...ventas);
    const mejorMes = ventasData.find(m => m.ventas === max);
    const peorMes = ventasData.find(m => m.ventas === min);
    
    return { total, promedio, max, min, mejorMes, peorMes };
  }, [ventasData]);

  const descargarPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = '/logo.png';
    const title = 'Reporte de Ventas';
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();

    const mensaje = "Estimado vendedor:\n" +
      "Este reporte refleja hasta el día de hoy todas sus ventas registradas en nuestra plataforma.\n" +
      "Queremos felicitarle y agradecerle sinceramente por su dedicación, esfuerzo y compromiso diario.\n" +
      "Cada venta representa no solo un logro comercial, sino también el resultado de su pasión, constancia y trabajo en equipo.\n\n" +
      "Gracias por confiar en nosotros y por ser parte fundamental de nuestra familia.\n" +
      "Recuerde que cada meta alcanzada es un paso más hacia sus sueños y que juntos seguiremos creciendo y superando nuevos retos.\n\n" +
      "¡Siga adelante, su éxito es nuestro orgullo!\n\n" +
      "Con aprecio,\n" +
      "El equipo de JosniShop";

    const render = () => {
      doc.setFontSize(20);
      doc.setTextColor('#1f618d');
      doc.text(title, 140, 50);
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(`Generado: ${generatedAtStr}`, 140, 68);

      const mensajeLines = doc.splitTextToSize(mensaje, pageWidth - 80);
      doc.setFontSize(11);
      doc.setTextColor('#222');
      doc.text(mensajeLines, 40, 100);

      const startY = 120 + mensajeLines.length * 12;
      if (ventasData.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay datos para mostrar.', 40, startY);
      } else {
        const headers = ['Mes', 'Ventas', 'Rendimiento'];
        const rows = ventasData.map(v => [v.nombre, `$${v.ventas.toFixed(2)}`, v.performance.toUpperCase()]);
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY,
          styles: { fontSize: 10 },
          headStyles: { fillColor: '#27ae60', textColor: '#fff' },
          margin: { left: 40, right: 40 }
        });
      }

      doc.setFontSize(9);
      doc.setTextColor('#777');
      doc.text(`Última vista: ${generatedAtStr}`, 40, doc.internal.pageSize.getHeight() - 30);

      doc.save('reporte_ventas.pdf');
    };

    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight);
      render();
    };
    img.onerror = () => {
      render();
    };
  };

  // Construir datos para la gráfica
  const labels = ventasData.map(m => m.nombre);
  const dataVentas = ventasData.map(m => m.ventas);
  const colores = ventasData.map(m => COLORES_PERFORMANCE[m.performance]);

  const chartVentas = {
    labels,
    datasets: [
      {
        label: "Ventas",
        data: dataVentas,
        backgroundColor: colores,
        borderColor: colores.map(c => c + 'dd'),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontSize: "1rem",
    background: "#f9f9f9",
    marginRight: "0.75rem",
    minWidth: "100px",
    transition: "border-color 0.3s",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    minWidth: "130px",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 24px",
    border: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 6px #00000015",
  };

  const pdfButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #2980b9 0%, #1f618d 100%)",
    marginRight: "1rem"
  };

  const containerStyle: React.CSSProperties = {
    padding: "2rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
    minHeight: "100vh",
  };

  const chartContainerStyle: React.CSSProperties = {
    marginTop: "2.5rem",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px #0001",
    padding: "2.5rem",
    textAlign: "center",
    border: "1px solid #e8e8e8",
  };

  const statsContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
    marginBottom: "2rem",
  };

  const statCardStyle = (color: string): React.CSSProperties => ({
    background: "#ffffff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px #0001",
    borderLeft: `4px solid ${color}`,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  });

  const controlsStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px #0001",
    border: "1px solid #e8e8e8",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#1f618d", marginBottom: "0.5rem", fontSize: "2rem" }} className="page-title">
        📊 Análisis de Ventas
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Visualiza y analiza el rendimiento de tus ventas por período
      </p>

      {/* Controles */}
      <div style={controlsStyle}>
        <select
          value={type}
          onChange={e => setType(e.target.value as QueryType)}
          style={selectStyle}
        >
          <option value="anio">Por Año (12 Meses)</option>
          <option value="mes">Por Mes</option>
          <option value="dia">Por Día</option>
        </select>
        
        <input
          type="number"
          value={anio}
          onChange={e => setAnio(Number(e.target.value))}
          placeholder="Año"
          style={inputStyle}
        />
        
        {type !== "anio" && (
          <input
            type="number"
            value={mes ?? ""}
            onChange={e => setMes(Number(e.target.value))}
            placeholder="Mes"
            min={1}
            max={12}
            style={inputStyle}
          />
        )}
        
        {type === "dia" && (
          <input
            type="number"
            value={dia ?? ""}
            onChange={e => setDia(Number(e.target.value))}
            placeholder="Día"
            min={1}
            max={31}
            style={inputStyle}
          />
        )}
        
        <button 
          onClick={consultarVentas} 
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 12px #00000025";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 6px #00000015";
          }}
        >
          Consultar
        </button>
      </div>

      {/* Botón de descarga PDF */}
      <button
        onClick={descargarPDF}
        style={pdfButtonStyle}
        disabled={ventasData.length === 0}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 12px #00000025";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 6px #00000015";
        }}
      >
        Descargar PDF
      </button>

      {/* Estadísticas */}
      {estadisticas && (
        <div style={statsContainerStyle}>
          <div style={statCardStyle('#27ae60')}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Total Ventas</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#27ae60' }}>
              ${estadisticas.total.toFixed(2)}
            </span>
          </div>

          <div style={statCardStyle('#2980b9')}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Promedio Mensual</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2980b9' }}>
              ${estadisticas.promedio.toFixed(2)}
            </span>
          </div>

          <div style={statCardStyle('#f39c12')}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Mejor Mes</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f39c12' }}>
              {estadisticas.mejorMes?.nombre}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#27ae60', fontWeight: 'bold' }}>
              ${estadisticas.mejorMes?.ventas.toFixed(2)}
            </span>
          </div>

          <div style={statCardStyle('#e74c3c')}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Peor Mes</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {estadisticas.peorMes?.nombre}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#e74c3c', fontWeight: 'bold' }}>
              ${estadisticas.peorMes?.ventas.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Gráfica */}
      {ventasData.length > 0 && (
        <div style={chartContainerStyle}>
          <h2 style={{ color: "#1f618d", marginBottom: "2rem" }}>
            📈 Gráfico de {type === "anio" ? "Ventas por Mes del Año" : type === "mes" ? "Ventas del Mes" : "Ventas Diarias"}
          </h2>
          <div style={{ position: "relative", height: "400px" }}>
            <Bar 
              data={chartVentas} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    display: true,
                    labels: {
                      font: { size: 14 },
                      padding: 20,
                      usePointStyle: true,
                    }
                  },
                  title: { 
                    display: false
                  },
                  tooltip: {
                    backgroundColor: '#00000080',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    borderColor: '#fff',
                    borderWidth: 1,
                    displayColors: true,
                    callbacks: {
                      label: function(context) {
                        return `Ventas: $${context.parsed.y.toFixed(2)}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      },
                      font: { size: 11 }
                    },
                    grid: {
                      color: '#f0f0f0',
                      drawBorder: false
                    }
                  },
                  x: {
                    ticks: {
                      font: { size: 11 }
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>

          {/* Leyenda de rendimiento */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: COLORES_PERFORMANCE.alto, borderRadius: '4px' }}></div>
              <span style={{ color: '#666' }}>Excelente (Arriba del promedio)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: COLORES_PERFORMANCE.medio, borderRadius: '4px' }}></div>
              <span style={{ color: '#666' }}>Bueno (Promedio)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: COLORES_PERFORMANCE.bajo, borderRadius: '4px' }}></div>
              <span style={{ color: '#666' }}>Bajo (Debajo del promedio)</span>
            </div>
          </div>
        </div>
      )}

      {ventasData.length === 0 && (
        <div style={{
          marginTop: '2rem',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px #0001',
          border: '2px dashed #ddd'
        }}>
          <p style={{ color: '#999', fontSize: '1.1rem' }}>
            Selecciona los parámetros y haz clic en "Consultar" para ver tu análisis de ventas
          </p>
        </div>
      )}
    </div>
  );
};

export default Ventas;
