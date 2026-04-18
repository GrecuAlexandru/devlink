# backend and db commands

make sure you run all these from inside the `dotnetbackend` folder.

### docker (postgres db)
start the db:
```bash
cd Deployment
docker-compose up -d
cd ..
```

wipe the docker db volume completely (if it gets stuck or ports are blocked):
```bash
cd Deployment
docker-compose down -v
docker-compose up -d
cd ..
```

### ef core migrations
add a new migration after changing c# models:
```bash
dotnet ef migrations add <YourMigrationName> --project MobyLabWebProgramming.Database --startup-project MobyLabWebProgramming.Api
```

apply migrations to update the database schema:
```bash
dotnet ef database update --project MobyLabWebProgramming.Database --startup-project MobyLabWebProgramming.Api
```

drop the database (wipes all existing tables and data):
```bash
dotnet ef database drop --force --project MobyLabWebProgramming.Database --startup-project MobyLabWebProgramming.Api
```

### run the backend
```bash
dotnet build
dotnet run --project MobyLabWebProgramming.Api
```