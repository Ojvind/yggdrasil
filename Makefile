dev-up:
	docker compose -f docker-compose.yml -p yggdrasil-dev up -d

dev-down:
	docker compose -f docker-compose.yml -p yggdrasil-dev down

prod-up:
	docker compose -f docker-compose-prod.yml -p yggdrasil up -d

prod-down:
	docker compose -f docker-compose-prod.yml -p yggdrasil down
