A small README for backend

- Copy .env.example to .env and adjust values
- Install dev deps: npm install
- Run locally: npm run dev
- Run with docker-compose: docker-compose up --build
- Tests: npm test

Notes:
- Add real EMAIL/SMS provider credentials to implement password reset flows
- Consider adding refresh tokens and Redis for session management