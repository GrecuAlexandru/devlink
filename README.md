## 1. Baza de date
Este nevoie de un container de Postgres.

```bash
cd dotnetbackend/Deployment
docker-compose up -d
```

## 2. Backend
Intra in folderul `dotnetbackend` unde e solutia si deschide-o in Rider.
Modifica setarile de conexiune daca e cazul.
Da Run aplicatiei de backend

```bash
cd devlink
openapi-generator-cli generate -i http://localhost:5000/swagger/v1/swagger.json -g typescript-fetch -o ./src/infrastructure/apis/client --additional-properties=supportsES6=true
```

## 3. Frontend
Din folderul /devlink
```bash
npm install
npm run dev
```

