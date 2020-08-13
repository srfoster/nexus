const { app, epStart, subnauticaGreet } = require('../src/app')

describe('App', () => {
  it(`GET ${epStart} responds with 200 containing ${subnauticaGreet}`, () => {
    return supertest(app)
      .get(epStart)
      .expect(200, subnauticaGreet)
  })
})