API Test Templates
------------------

Use these curl examples or import into Postman / Hoppscotch.

1) Register user
curl -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d '{ "name":"Test","email":"test@example.com","password":"pass1234" }'

2) Login
curl -X POST http://localhost:4000/auth/login -H 'Content-Type: application/json' -d '{ "email":"test@example.com","password":"pass1234" }'

3) Generate AI challenge (no auth)
curl http://localhost:4000/ai/generate?type=music&difficulty=easy

4) Create Challenge (auth required)
curl -X POST http://localhost:4000/createChallenge -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{ "type":"music","prompt":"Guess this","options":["A","B"],"difficulty":"easy" }'
