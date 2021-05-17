#!/bin/bash

echo "Waiting to be sure postgres container fully starts first " #Can we get docker compose to check this for us??

sleep 10

if psql postgresql://postgres:example@db/spells -c '\q' 2>&1; then
	echo "DB FOUND!"
else
	echo "NO DB FOUND!  Creating DB"
	psql postgresql://postgres:example@db -c "create database spells"

	echo "Creating Tables"
	npm run migrate 

	echo "Creating Seed Data"
	psql postgresql://postgres:example@db/spells -f ./seeds/seed.tables.sql
fi


npm run dev
