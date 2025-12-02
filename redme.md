JOSNISHOP: 📈 Aplicación del Proceso Personal de Software (PSP)
Este archivo documenta el desarrollo del proyecto de e-commerce JOSNISHOP y sirve como archivo para el proceso de desarrollo y la evaluación del desempeño personal (PSP).

El equipo estuvo compuesto por Josthin Paz y Nicol Amaya, y el proyecto se ejecutó de Abril a Noviembre de 2025.

1. 🎯 Objetivos y Principios del PSP
El PSP fue aplicado para analizar la predictibilidad, la calidad y la eficiencia del proceso, siguiendo los principios de mejora continua de Watts Humphrey.

Objetivos Clave en JOSNISHOP
Gestión de la Calidad: El objetivo de calidad se cumplió con una baja densidad de defectos final de 0.07 Defectos/KLOC.

Reducción de Defectos: Se utilizaron métodos de calidad (PSP2) como la Revisión de Código y la Definition of Done (DoD) para mantener esta calidad.

Mejorar Estimaciones (Pendiente): Se identificó una gran necesidad de aplicar los principios de PSP1.1 (Estimación), dado que el esfuerzo real excedió al estimado en +24.1%.

2. 🛠️ Estructura del Proceso y Tecnologías
JOSNISHOP es una aplicación moderna (desarrollo Nuevo) que utiliza:

Backend: Python con FastAPI (APIs de alto riesgo como el inventario en tiempo real).

Frontend: React con Typescript y Vite.

Fases del Proceso JOSNISHOP (Medición PSP)
El análisis PSP demostró que las desviaciones más grandes ocurrieron en los extremos del ciclo de desarrollo:

Planificación: Esta fase sufrió una desviación del +66.7% debido a la subestimación de la complejidad de funcionalidades clave (ej., Inventario, Chatbot).

Codificación: La desviación fue del +20.8%.

Pruebas (PSP Test Phase): Esta fase se desvió en +50.0%, lo que indica que la detección de defectos se realizó de forma tardía.

Revisión / QA (PSP Code Review): Esta fase se desvió en +60.0%, lo que confirma el alto coste del rework necesario para corregir los defectos.

3. 📊 Análisis de Datos y Calidad PSP
El PSP enfatiza el uso de datos históricos (Tamaño, Esfuerzo, Calidad) para la mejora del proceso.

Métricas Clave
Tamaño (LOC): El tamaño final (2,500,679 líneas) fue mayor al estimado (2,288,679 líneas).

Esfuerzo (Tiempo): El esfuerzo real (180 horas) superó al estimado (145 horas), resultando en la desviación del +24.1%.

Productividad: Se logró una alta productividad de 15,783.99 LOC/hora, un éxito individual.

Calidad (Defectos): La densidad de defectos final fue de 0.07 Defectos/KLOC.

Hallazgo Crítico (Detección de Defectos)
A pesar de la alta calidad final, el proceso fue ineficiente. La gran sobrecarga en las fases de Pruebas y Revisión/QA (más del +50% de desviación) confirma la teoría del PSP: los defectos se removieron tarde. Es más económico y efectivo remover defectos tan cerca como sea posible de donde fueron inyectados.

4. 📝 Conclusiones y Plan de Mejora (PIP)
Conclusión Final
El proyecto demostró un alto nivel de calidad y eficiencia. Sin embargo, el análisis PSP enfatizó que "estimar no es adivinar". La gran desviación en el tiempo fue una lección sobre la necesidad de formalizar la estimación y la detección temprana de errores.

Plan Personal de Mejora (PIP)
Para avanzar en el nivel de madurez PSP2.1, se implementará:

Mejorar Estimación (PSP1.1): Utilizar el método PROBE y aplicar un buffer de riesgo (ej., 30%) a las estimaciones para reducir la desviación de la planificación al < 10%.

Detección Temprana de Defectos (PSP2): Implementar Integración Continua (CI/CD) para ejecutar pruebas unitarias automáticas. Se formalizarán el Design Review y el Code Review (usando checklists), moviendo la detección de defectos a la fase de codificación.