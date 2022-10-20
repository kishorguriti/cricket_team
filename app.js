const express = require("express");
const app = express();

app.use(express.json());

const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
let db = null;

const instAndStartingServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server Running");
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};

instAndStartingServer();

// GET all players API

app.get("/players/", async (request, response) => {
  const playerDetails = `SELECT * FROM cricket_team  ORDER By player_id;`;

  const playersArray = await db.all(playerDetails);
  response.send(playersArray);
});

// Adding NewPlayer API2

app.post("/players/", async (request, response) => {
  const AddPlayer = request.body;
  const { playerName, jerseyNumber, role } = AddPlayer;

  const addPlayerSql = `INSERT INTO cricket_team
            (player_name, jersey_number, role)
            VALUES
            ("  ${playerName}",${jerseyNumber},"${role}");

            `;

  const addingPlayer = await db.run(addPlayerSql);
  //const playerId = addingPlayer.lastID;

  response.send("Player Added to Team");
});

module.exports = app;

// get a player Based on id  api3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerSql = `SELECT * FROM cricket_team WHERE  player_id=${playerId};`;

  const gettingPlayer = await db.get(getPlayerSql);
  response.send(gettingPlayer);
});

// put  updating a player api4

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;

  const updatingPlayer = request.body;

  const { playerName, jerseyNumber, role } = updatingPlayer;

  const updatingSql = `UPDATE 
  cricket_team 
  SET  
   player_name= '${playerName}' , 
   
   jersey_number='${jerseyNumber}' ,

   role = '${role}' ; 

   WHERE 
   player_id='${playerId}
    `;

  const updatedArray = await db.run(updatingSql);
  response.send("Player Details Updated");
});

// delete the player from db

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerSql = `DELETE 
    FROM cricket_team 
    WHERE player_id=${playerId};`;

  const deleting = await db.run(deletePlayerSql);
  response.send("Player Removed");
});
