const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
const PORT_NU = 3000
const TBALE_NAME = 'cricket_team'

let dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
app.use(express.json())

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(PORT_NU, () =>
      console.log(
        `Server is running at https://nitishbfiesnjscpxtwms.drops.nxtwave.tech/players and port nu ${PORT_NU}`,
      ),
    )
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}
initializeDbAndServer()

app.get('/', (req, res) => {
  res.send('welcom to player app!')
})

app.get('/players/', async (req, res) => {
  let query = `select * from ${TBALE_NAME};`

  let allPlayers = await db.all(query)
  res.send(allPlayers)
})

app.get('/players/:playerId', async (req, res) => {
  let {playerId} = req.params

  let query = `
    select * from ${TBALE_NAME} where player_id=${playerId};`

  let dbResponse = await db.get(query)
  res.send(dbResponse)
})

app.post('/players/', async (req, res) => {
  const {playerName, jerseyNumber, role} = req.body

  let query = `insert into ${TBALE_NAME} (player_name, jersey_number, role) 
    values("${playerName}", ${jerseyNumber}, "${role}");`

  let dbResponse = await db.run(query)
  res.send("Player Added to Team");
})

app.put('/players/:playerId', async (req, res) => {
  const {playerId} = req.params
  const {playerName, jerseyNumber, role} = req.body

  let query = `
    update ${TBALE_NAME}
    set player_name="${playerName}",
    jersey_number=${jerseyNumber},
    role="${role}"
    where player_id=${playerId};`

  let dbResponse = await db.run(query)
  res.send('Player Details Updated');
})

app.delete('/players/:playerId', async (req, res) => {
  const {playerId} = req.params

  let query = `
    delete from ${TBALE_NAME}
    where player_id=${playerId};`

  let dbResponse = await db.run(query)
  res.send('Player Removed');
})

module.exports = app
