const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env-local' });
const pool = require('./public/scripts/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/checksign', async (req, res) => {
    const email = req.body.email;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const user = req.body.username;
    const pass = req.body.password;

    console.log(req.body);

    console.log(email)
    try {
        //const {email, password} = req.body;

        //const encryptedPassword = await bcrypt.hash(password,10)

        const sqlQuery = 'INSERT INTO user (firstname,lastname, username, password, email) VALUES (?,?,?,?,?)';
        const result = await pool.query(sqlQuery, [fname, lname, user, pass, email]);

        res.status(200).json({ userId: result.insertId });
    } catch (error) {
        res.status(400).send(error.message)
    }
});
app.get('/addPlayers', (req, res) => {
    res.render('addplayers.ejs');
})
app.get('/createtournament', (req, res) => {
    res.render('createtournament.ejs');
})

app.post('/createtournament/addteams', async (req, res) => {
    //console.log(req.body);
    //res.send(req.body);
    let { tourname, tourformat, totalteam, touryear } = req.body;
    let numteams = parseInt(req.body.numteam);
    //console.log(tourname + " " + tourformat + " " + numteams + " " + touryear);
    try {
        // const {email, password} = req.body;

        // const encryptedPassword = await bcrypt.hash(password,10)

        const sqlQuery = 'INSERT INTO tournament (name, format, tot_teams, year) VALUES (?,?,?,?)';
        const result = await pool.query(sqlQuery, [tourname, tourformat, numteams, touryear]);

        //res.status(200).json({ tourId: result.insertId });
        const tour_id = result.insertId;


        res.render('addteam', { tourid: tour_id });
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/createtournament/:tourid/addteam', async (req, res) => {
    let tour_id = req.params.tourid;

    try {

        const query = 'INSERT INTO team (team_name,tour_id) VALUES (?,?)';
        const result = await pool.query(query, [req.body.addteam, tour_id]);
        const team_id = result.insertId;

        res.redirect(`/createtournament/${tour_id}/team`);

    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/createtournament/:tourid/team', async (req, res) => {
    let tour_id = req.params.tourid;
    const sqlQuery = 'SELECT * from team WHERE tour_id=?';
    const rows = await pool.query(sqlQuery, tour_id);
    res.render('addteams', { tourid: tour_id, row: rows });
})

app.get('/createtournament/:tourid/addteam/:teamid', (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;
    res.redirect(`/createtournament/${tour_id}/${team_id}/player`);

})

app.post('/createtournament/:tourid/:teamid/addplayer', async (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;
    let { playername, playerage, playerskill, arm, playerrole, salary } = req.body;

    //console.log(playername + " " + playerage + " " + playerskill + " " + arm + " " + playerrole + " " + salary); 

    const query = 'INSERT INTO player (name,skill, hand, salary, team_id, age,role) VALUES (?,?,?,?,?,?,?)';
    const result = await pool.query(query, [playername, playerskill, arm, salary, team_id, playerage, playerrole]);
    const player_id = result.insertId;

    res.redirect(`/createtournament/${tour_id}/${team_id}/player`);

})

app.get('/createtournament/:tourid/:teamid/player', async (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;

    const sqlQuery = 'SELECT * from player WHERE team_id=?';
    const rows = await pool.query(sqlQuery, team_id);

    if (rows.length > 0) {
        res.render('addplayer', { teamid: team_id, row: rows, tourid: tour_id })
    } else {
        res.render('addplayers', { teamid: team_id, tourid: tour_id });
    }

})

app.post('/createtournament/:tourid/addmatch', async (req, res) => {
    let tour_id = req.params.tourid;
    let { teamone, teamtwo, venue, startdate, enddate } = req.body;
    const query = 'INSERT INTO match (tour_id , team1_id , team2_id , venue , startdate , enddate) VALUES (?,?,?,?,?,?)';
    const result = await pool.query(query, [tour_id, teamone, teamtwo, venue, startdate, enddate]);
    const match_id = result.insertId;

    res.redirect(`/createtournament/${tour_id}/match`);

})

app.get('/createtournament/:tourid/match', async (req, res) => {
    let tour_id = req.params.tourid;

    const sqlQuery = 'select team_name from team where tour_id=?';
    const rows = await pool.query(sqlQuery, tour_id);

    const query = 'select * from match where tour_id=?';
    const result = await pool.query(query, tour_id);

    if (result.length > 0) {
        res.render('addmatches', { tourid: tour_id, row: rows, matches: result });
    } else {
        res.render('addmatch', { tourid: tour_id, row: rows })
    }



})

app.get('*', () => {
    res.render('error404');
});

app.listen(8000, () => {
    console.log('Listening on Port 8000 . . .');
});








//res.send('Welcome to CricIt.');
    // try {
    //     const sqlQuery = 'SELECT * FROM player';
    //     const rows = await pool.query(sqlQuery, req.params.id);
    //     res.status(200).json(rows);
    // } catch (error) {
    //     res.status(400).send(error.message)
    // }
    // try {
    //     //const {email, password} = req.body;

    //     //const encryptedPassword = await bcrypt.hash(password,10)

    //     const sqlQuery = 'INSERT INTO player (id, name,skill,hand,salary) VALUES (?,?,?,?,?)';
    //     const result = await pool.query(sqlQuery, [1, 'Virat Kohli', 'Batter', 'Right', 70000000]);

    //     res.status(200).json({ userId: result.insertId });
    // } catch (error) {
    //     res.status(400).send(error.message)
    // }
