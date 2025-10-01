# 📋 Carga Masiva de Usuarios - MedCore

## 🎯 Objetivo

Permitir el registro masivo de usuarios con roles específicos desde archivos CSV o JSON.
**El rol por defecto es ADMINISTRADOR**, quien gestiona la creación de todas las otras cuentas.

## 🏥 Roles del Sistema

- `ADMINISTRADOR` - **Rol por defecto** - Gestiona el sistema y crea otras cuentas
- `MEDICO` - Personal médico con especialización
- `ENFERMERA` - Personal de enfermería
- `PACIENTE` - Pacientes del hospital

## 📊 Campos Soportados

- **Básicos:** email, fullname, currentPassword, role
- **Médicos:** specialization, licenseNumber
- **Generales:** department, phone, dateOfBirth

## 🗃️ Formato CSV

```csv
email,fullname,role,current_password,specialization,department,license_number,phone,date_of_birth
doctor1@medcore.com,Dr. Ana María González,MEDICO,TempPass123!,CARDIOLOGIA,MEDICINA_INTERNA,12345-MD,+57-300-1234567,1985-03-15
nurse1@medcore.com,María Elena Rodríguez,ENFERMERA,TempPass123!,,URGENCIAS,,+57-300-2345678,1990-07-22
admin1@medcore.com,Carlos Alberto Méndez,ADMINISTRADOR,TempPass123!,,ADMINISTRACION,,+57-300-3456789,1980-11-08
patient1@medcore.com,Luis Fernando Castro,PACIENTE,TempPass123!,,,,,1995-09-12
```

## 🚀 Endpoints Implementados

### 1. Crear Usuario Individual

```http
POST /api/v1/users
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "fullname": "Dr. Juan Pérez",
  "currentPassword": "medico123",
  "role": "MEDICO",
  "specialization": "CARDIOLOGIA",
  "department": "MEDICINA_INTERNA",
  "licenseNumber": "12345-MD",
  "phone": "+57-300-1234567",
  "dateOfBirth": "1985-03-15"
}
```

### 2. Carga Masiva de Usuarios

```http
POST /api/v1/users/bulk
Content-Type: application/json

{
  "users": [
    {
      "email": "doctor1@medcore.com",
      "fullname": "Dr. Ana María González",
      "role": "MEDICO",
      "currentPassword": "TempPass123!",
      "specialization": "CARDIOLOGIA",
      "department": "MEDICINA_INTERNA",
      "licenseNumber": "12345-MD",
      "phone": "+57-300-1234567",
      "dateOfBirth": "1985-03-15"
    }
  ]
}
```

### 3. Obtener Usuarios por Rol

```http
GET /api/v1/users/role/MEDICO
GET /api/v1/users/role/ENFERMERA
GET /api/v1/users/role/PACIENTE
GET /api/v1/users/role/ADMINISTRADOR
```

## 🧪 Ejemplo de Prueba con tu CSV

### Usar cURL para carga masiva:

```bash
curl -X POST http://localhost:3000/api/v1/users/bulk \\
  -H "Content-Type: application/json" \\
  -d @examples/carga_csv_medcore.json
```

### Respuesta esperada:

```json
{
  "message": "Carga masiva completada",
  "summary": {
    "total": 4,
    "successful": 4,
    "failed": 0
  },
  "results": {
    "successful": [
      {
        "index": 0,
        "user": {
          "id": "...",
          "email": "doctor1@medcore.com",
          "fullname": "Dr. Ana María González",
          "role": "MEDICO",
          "specialization": "CARDIOLOGIA",
          "department": "MEDICINA_INTERNA",
          "licenseNumber": "12345-MD",
          "phone": "+57-300-1234567"
        }
      }
    ],
    "failed": []
  }
}
```

## 🔒 Características de Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validación de datos con Zod
- ✅ Códigos de verificación temporales (15 min)
- ✅ Manejo de errores centralizado
- ✅ Prevención de emails duplicados
- ✅ Validación de roles específicos
- ✅ Campos opcionales para flexibilidad

## 📋 Schema de Base de Datos

```prisma
model Users {
  id                      String    @id @default(auto()) @map("_id") @db.ObjectId
  email                   String    @unique
  fullname                String
  currentPassword         String
  role                    String    @default("ADMINISTRADOR")
  status                  String    @default("PENDING")
  specialization          String?   // Para médicos
  department              String?   // Departamento de trabajo
  licenseNumber           String?   // Licencia médica
  phone                   String?   // Teléfono
  dateOfBirth             DateTime? // Fecha de nacimiento
  verificationCode        String?
  verificationCodeExpires DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}
```

## 📝 Flujo de Trabajo Recomendado

1. **Administrador** se registra primero (rol por defecto)
2. **Administrador** usa carga masiva para crear cuentas de médicos, enfermeras y pacientes
3. Cada usuario recibe código de verificación por email
4. Usuarios verifican su cuenta para activarla

## 🛠️ Utilidad CSV to JSON

Se incluye un script para convertir CSV a JSON:

```javascript
const { csvToJson } = require("./utils/csvToJson");
csvToJson("path/to/your/file.csv", "output.json");
```
