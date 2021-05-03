# Getting Started

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

