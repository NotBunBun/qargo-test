# Qargo Notes

Aplicación web para gestión de notas estilo Kanban.

## Tecnologías

**Backend:**
- Django 5.0
- Django REST Framework
- PostgreSQL
- JWT para autenticación

**Frontend:**
- React 19
- Vite
- Zustand (estado)
- @dnd-kit (drag and drop)
- Framer Motion
- Tailwind CSS

## Instalación

### Con Docker (recomendado)

```bash
git clone https://github.com/yourusername/qargo-notes.git
cd qargo-notes
cp .env.example .env
docker-compose up --build
```

La app estará en http://localhost:5173

### Sin Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

Crear archivo `.env` en la raíz:

```
# Database
DB_NAME=qargo_notes
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# Django
SECRET_KEY=django-insecure-m8k#2p$9x@r4v!7w*qn5t&8yl^3zu%6hj#1fg$4sd*9ka^2pl
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:80,http://localhost

# Frontend
VITE_API_URL=http://localhost:8000/api

```

## Comandos Docker útiles

```bash
# Ver logs
docker-compose logs -f

# Crear superuser
docker-compose exec backend python manage.py createsuperuser

# Bajar servicios
docker-compose down

# Bajar y borrar volúmenes
docker-compose down -v
```

## API Endpoints

### Autenticación
- POST `/api/auth/register/` - Registro
- POST `/api/auth/login/` - Login
- POST `/api/auth/refresh/` - Refrescar token
- GET `/api/auth/me/` - Info usuario actual

### Columnas
- GET `/api/columns/` - Listar columnas
- POST `/api/columns/` - Crear columna
- PUT `/api/columns/{id}/` - Actualizar
- DELETE `/api/columns/{id}/` - Eliminar
- PATCH `/api/columns/reorder/` - Reordenar

### Notas
- GET `/api/notes/` - Listar notas
- POST `/api/notes/` - Crear nota
- PUT `/api/notes/{id}/` - Actualizar
- DELETE `/api/notes/{id}/` - Eliminar
- PATCH `/api/notes/{id}/move/` - Mover nota
- PATCH `/api/notes/{id}/archive/` - Archivar/desarchivar

Filtros disponibles: `?column_id=uuid&is_archived=true&search=texto`

## Estructura del proyecto

```
qargo-notes/
├── backend/
│   ├── apps/
│   │   ├── users/
│   │   ├── columns/
│   │   └── notes/
│   ├── qargo_notes/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
└── docker-compose.yml
```

## Características principales

- Autenticación con JWT
- Crear columnas personalizadas con colores
- Drag and drop de notas entre columnas
- Archivar notas
- Búsqueda en tiempo real
- Exportar notas (JSON/Markdown)
- Atajos de teclado (n: nueva nota, c: nueva columna, /: buscar)
- Modo oscuro

## Notas de desarrollo

Todo el código está en inglés (variables, funciones, etc.) pero la UI está en español siguiendo las buenas prácticas del proyecto.

## Licencia

Proyecto creado como evaluación técnica para Qargo.
