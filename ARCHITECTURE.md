# ARQUITECTURA TÉCNICA CUIDAPP+ (Investor-Ready)

## 1. PRODUCT LAWS (Leyes del Producto)

### 1.1 El Modelo de Datos B2B (Jerarquía y Recurrencia)
*   **Jerarquía B2B**: Entidad `Empresa` -> `Beneficiario` (Paciente) -> `Círculo de Confianza`.
*   **Recurrencia Nativa**: Los viajes no son solo eventos únicos; son planes de terapia con lógica RRULE (Recurrence Rule).
*   **Safety_Profile**: El registro médico es un módulo independiente vinculado al paciente, no al viaje.

### 1.2 Logística de Cuidados (Checkpoints)
*   Flujo obligatorio para el Asistente: `[Llegada al origen]` -> `[Paciente a bordo]` -> `[Llegada al destino]` -> `[Entrega confirmada]`.
*   Cada checkpoint dispara un webhook de notificación.

### 1.3 Seguridad y Privacidad
*   **Círculo de Confianza**: Notificaciones vía webhook (n8n integration) para cambios de estado críticos.
*   **Cifrado**: Datos sensibles de salud cifrados en reposo.

## 2. ROLES Y ACCESO
*   **Usuario (Senior)**: Interfaz simplificada "One-Touch".
*   **Familiar Responsable**: Gestión de planes recurrentes y monitoreo.
*   **Asistente de Movilidad**: Interfaz de logística certificada con checkpoints.
*   **Administrador B2B**: Dashboard corporativo para gestión de beneficiarios.

## 3. GESTIÓN MÉDICA
### 3.1 Viaje Único (Mini Ficha)
*   Datos: Nombre, Discapacidad, Tipo de Sangre, Alergias.

### 3.2 Plan de Terapias (Ficha B2B Full)
*   Datos: Historial clínico, Recetas, Contactos de emergencia, Seguro.
*   Logística: Calendario de sesiones vinculadas a RRULE.

## 4. REGLAS DE DISEÑO (Manifiesto Cuidapp+)
*   **Cero Negro Absoluto**: Uso de `#6C5CE7` (Violeta) y `#0052CC` (Azul).
*   **Tipografía Fluida**: Italics en todos los headers, botones y labels (`font-italic`).
*   **Moneda**: Siempre USD (Dólares Americanos) para el mercado de Ecuador.

## 5. INTEGRACIONES SÍNCRONAS
*   **Stitch**: Persistencia de datos B2B.
*   **n8n**: Webhooks para el Círculo de Confianza.
