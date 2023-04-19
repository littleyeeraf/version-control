connect-db:
	docker exec -it version-control-db-1 /usr/bin/psql -U yeeraf -d kontrol

migrate:
	npx prisma db push

generate:
	npx prisma generate
