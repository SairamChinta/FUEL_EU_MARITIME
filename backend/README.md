# Backend

Run the backend (dev):

```powershell
cd backend
npm run dev
```

This starts an express server on port 3001 and serves these endpoints used by the frontend:
- GET /routes
- POST /routes/:routeId/baseline
- GET /routes/comparison
- GET /compliance/calculate or /compliance/cb?shipId&year
- GET /compliance/adjusted-cb?shipId&year
- POST /banking/bank
- POST /banking/apply
- GET /banking/records
- POST /pools

Run tests:

```powershell
cd backend
npm run test
```
