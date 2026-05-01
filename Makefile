dev-up:
	docker compose -f docker-compose.yml -p brage-dev up -d

dev-down:
	docker compose -f docker-compose.yml -p brage-dev down

prod-up:
	docker compose -f docker-compose-prod.yml -p brage-prod up -d

prod-down:
	docker compose -f docker-compose-prod.yml -p brage-prod down
