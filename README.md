# nexus
The Nexus of the CodeSpells community. Deployed at [nexus.codespells.org](http://nexus.codespells.org). 

## Installation:

Pre-Installation:
(Windows users only)
```
git config --global core.autocrlf false
```

Main Installation:
```
git clone git@github.com:srfoster/nexus.git
cd nexus
docker-compose -f stack.yml build
```

## Development:

```
docker-compose -f stack.yml up
```

The database should get created and seeded the first time you do this.

Now you should be able to edit files in `frontend/` or `backend/`.  Reloading should be automatic.

## Running tests:

```
docker exec -it backend npm run test
docker exec -it frontend npm run test
```

Or you can run a specific test with this command:
`docker exec -it frontend npm test -- FileTo.test.js`
`docker exec -it backend npm test -- FileTo.test.js`

# Production

For now (until we need to scale things up), we are running postgres in a docker container, with data persisted on the local machine.   

```
cd nexus
mkdir ../data
docker-compose -f prod-stack.yml up
```

Logging:

```
docker-compose -f prod-stack.yml logs -f -t prod-backend > backend.log 2>&1 &
```



