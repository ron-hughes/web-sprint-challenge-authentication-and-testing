const supertest = require("supertest")
const server = require("../index")
const db = require("../database/dbConfig")


afterAll(async () => {
	// closes the database connection so the jest command doesn't stall
	await db.destroy()
})



 describe('the auth register endpoint', function () {
      beforeEach(async () => {
        await db('users').truncate();
      });// end truncate db

      it('should return a status 201', function () {
        return supertest(server)
          .post('/api/auth/register')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .expect(201)
      });
      it('should return an object with message property', function () {
        return supertest(server)
          .post('/api/auth/register')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .then(res => {
            expect(res.body).toHaveProperty('message')
          });
      });
    });//end register endpoint
