connect-db:
	docker exec -it version-control-db-1 /usr/bin/psql -U yeeraf -d kontrol

dashboard:
	npx prisma studio

generate:
	npx prisma generate

migrate:
	npx prisma db push
