# Frontend Angular

## Opción 1 - Levantar frontend con Docker Compose

### 1.a - Requisitos
Asegúrate de que el archivo `Dockerfile` y `docker-compose.yml` están configurados en el directorio del frontend.

### 1.b - Levantar ambiente
Parados en la raíz del proyecto frontend, ejecutar:

```bash
docker-compose up 
```

## Opción 2 - Levantar frontend localmente con ng serve
### 2.a - Requisitos
Asegúrate de tener Node.js y Angular CLI instalados en tu máquina.

### 2.b - Instalar dependencias
Parados en la raíz del proyecto frontend, ejecutar:

```bash
npm install
```

### 2.c - Levantar ambiente
Ejecutar el siguiente comando para servir la aplicación:
```bash
ng serve -o 
```
Accede a la aplicación Angular en http://localhost:4200.