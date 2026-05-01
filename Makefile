dev-up:
	docker compose -f docker-compose.yml up -d

dev-down:
	docker compose -f docker-compose.yml down

prod-up:
	docker compose -f docker-compose-prod.yml up -d

prod-down:
	docker compose -f docker-compose-prod.yml down
