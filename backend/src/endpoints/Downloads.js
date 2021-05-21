const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let totalGames = await req.app.get('db')('downloads')
    .count()
  let games = await req.app.get('db')('downloads')
  res.send({games, total: Number(totalGames[0].count)})
}

module.exports = {
  handleGet,
}