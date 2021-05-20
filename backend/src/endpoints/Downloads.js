const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let totalGames = await req.app.get('db')('downloads')
    .where('*')
    .count()

  let games = await req.app.get('db')('downloads')
    .where('*')
  console.log(totalGames,games)
  res.send({games, total: Number(totalGames.rows[0].count)})
}

module.exports = {
  handleGet,
}