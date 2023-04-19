connect-db:
	docker exec -it version-control-db-1 /usr/bin/psql -U yeeraf -d kontrol

generate:
	npx prisma generate

migrate:
	npx prisma db push

dashboard:
	npx prisma studio
