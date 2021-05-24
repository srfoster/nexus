const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  try{
    let totalGames = await req.app.get('db')('downloads')
      .count()
    let games = await req.app.get('db')('downloads')
    res.send({games, total: Number(totalGames[0].count)})
    
  } catch (error) {
    console.log(error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handleGet,
}