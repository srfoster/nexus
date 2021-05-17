# Getting Started

# The Docker Way

Use this `.env` file:

```
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://postgres:example@db/spells"
DATABASE_URL_QUERY=""
TEST_DATABASE_URL="postgresql://postgres:example@db/spells-test"
JWT_SECRET="super-secret"
JWT_EXPIRY="720hr"
```

Build the image:

```
docker build . -t codespells-backend
```

Make sure you've built the front-end image too: https://github.com/srfoster/codespells-spell-sharing-front-end

Then, use this `stack.yml`

```
# Use postgres/example user/password credentials
version: '3.1'

services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: example

  backend:
    image: codespells-backend
    restart: always
    ports:
      - 8000:8000
    depends_on:
      - "db"

  frontend:
    image: codespells-frontend
    restart: always
    ports:
      - 3000:3000
    depends_on:
      - "backend"
```

Run:

```
docker-compose -f stack.yml up
```

To run migrations and seed your local db:

Find out backend hash:

```
docker ps
```

Exec into the backend for migration and seeding:

```
docker exec -it [hash for backend] bash
```

Run:

```
psql postgresql://postgres:example@db -c "create database spells"
npm run migrate
psql postgresql://postgres:example@db/spells -f ./seeds/seed.tables.sql
```

You should now be able to log in at `localhost:3000`



# The Not Docker Way

Clone the repo

`npm install`

Create a .env file on the root level and include the following:
```
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://admin@localhost/spells"
DATABASE_URL_QUERY=""
TEST_DATABASE_URL="postgresql://admin@localhost/spells-test"
JWT_SECRET="super-secret"
JWT_EXPIRY="720hr"
```

Change the postgres login information to match your login username
Create postgress databases called "spells" & "spells-test"

`npm run migrate`

`npm run seed`

