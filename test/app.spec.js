const { app, epStart, startupGreet } = require('../src/app')

describe('App', () => {
  it(`GET ${epStart} responds with 200 containing ${startupGreet}`, () => {
    return supertest(app)
      .get(epStart)
      .expect(200, startupGreet)
  })
})