.PHONY: install-all create-env migrate-db run-all kill-all

install-all: 
		npm run install:all

create-env: 
		@if [ ! -f ./my-ginko-server/.env ]; then \
				cp ./my-ginko-server/.env.example ./my-ginko-server/.env; \
				echo ".env created"; \
		else \
				echo ".env already exists"; \
		fi

migrate-db:
		npm --prefix my-ginko-server run migrate:up

run-all:
		npx concurrently \
				"npm --prefix malicious-ginko run dev" \
				"npm --prefix malicious-server run start" \
				"npm --prefix my-ginko run dev" \
				"npm --prefix my-ginko-server run start"

kill-all:
		pkill -f concurrently || true				