/*
Group 3: Assignment 12
Cricket Data Management System
Nirmit Deliwala - 191080022
Mann Doshi - 191080026
Donovan Crasta - 191080026
Meet Parekh - 191080055
Aayush J Shah - 191080067

Github Link : NRDeli/CricIt
Tech Stack Used : NodeJS, ExpressJS, MariaDB, HTML, CSS, Javascript, Bootstrap
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env-local' });
const pool = require('./public/scripts/database');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));


const isLoggedin = (req,res,next)=>{
    if(req.session.loggedin){
        next();
    }else{
        res.redirect('/login');
    }
}

const isAdmin = (req,res,next) => {
    if(req.session.name == 'admin12345'){
        next();
    }else{
        res.redirect('/dashboard');
    }
}



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

        const sqlQuery = 'INSERT INTO user (firstname,lastname, username, password) VALUES (?,?,?,?)';
        const result = await pool.query(sqlQuery, [fname, lname, user, pass]);

        res.redirect('/login');
    } catch (error) {
        res.status(400).send(error.message)
    }
});

app.post('/authenticate', async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;


    const sqlQuery = 'SELECT * FROM user WHERE username=? AND password=?';
    const rows = await pool.query(sqlQuery, [username, password]);
    if (rows.length <= 0) {
        //req.flash('error', 'Please correct enter email and Password!')
        res.redirect('/login')
    }
    else { // if user found
        // render to views/user/edit.ejs template file
        req.session.loggedin = true;
        req.session.name = rows[0].username;
        res.redirect('/dashboard');

    }
})


app.get('/logout', function (req, res) {
    req.session.destroy();
    //req.flash('success', 'Login Again Here');
    res.redirect('/login');
});


app.get('/dashboard', isLoggedin , (req, res) => {
    const username = req.session.name;
    res.render('dashboard', { user : username });
})


app.get('/addPlayers', isLoggedin ,(req, res) => {
    res.render('addplayers');
})
app.get('/createtournament', isAdmin ,(req, res) => {
    res.render('createtournament');
})

app.post('/createtournament/addteams' ,async (req, res) => {
    let { tourname, tourformat, totalteam, touryear } = req.body;
    let numteams = parseInt(req.body.numteam);
    try {
        const sqlQuery = 'INSERT INTO tournament (name, format, tot_teams, year) VALUES (?,?,?,?)';
        const result = await pool.query(sqlQuery, [tourname, tourformat, numteams, touryear]);

        const tour_id = result.insertId;


        res.render('addteams', { tourid: tour_id, row: [] });
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

app.get('/createtournament/:tourid/team', isAdmin , async (req, res) => {
    let tour_id = req.params.tourid;
    const sqlQuery = 'SELECT * from team WHERE tour_id=?';
    const rows = await pool.query(sqlQuery, tour_id);
    res.render('addteams', { tourid: tour_id, row: rows });
})

app.get('/createtournament/:tourid/addteam/:teamid', isAdmin , (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;
    res.redirect(`/createtournament/${tour_id}/${team_id}/player`);

})

app.post('/createtournament/:tourid/:teamid/addplayer', async (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;
    let { playername, playerage, playerskill, arm, playerrole, salary } = req.body;

    const query = 'INSERT INTO player (name,skill, hand, salary, team_id, age,role) VALUES (?,?,?,?,?,?,?)';
    const result = await pool.query(query, [playername, playerskill, arm, salary, team_id, playerage, playerrole]);
    const player_id = result.insertId;

    res.redirect(`/createtournament/${tour_id}/${team_id}/player`);

})

app.get('/createtournament/:tourid/:teamid/player', isAdmin ,async (req, res) => {
    let team_id = req.params.teamid;
    let tour_id = req.params.tourid;

    const sqlQuery = 'SELECT * from player WHERE team_id=?';
    const rows = await pool.query(sqlQuery, team_id);

    res.render('addplayer', { teamid: team_id, row: rows, tourid: tour_id });

})

app.post('/createtournament/:tourid/match', async (req, res) => {
    let tour_id = req.params.tourid;
    let teamone = req.body.teamone;
    let teamtwo = req.body.teamtwo;
    let venue = req.body.venue;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    const query = 'INSERT INTO matches  (tour_id , team1_name , team2_name , venue , start_date , end_date) VALUES (?,?,?,?,?,?)';
    const result = await pool.query(query, [tour_id, teamone, teamtwo, venue, startdate, enddate]);
    const match_id = result.insertId;

    res.redirect(`/createtournament/${tour_id}/addmatch`);

})

app.get('/createtournament/:tourid/addmatch', isAdmin , async (req, res) => {
    let tour_id = req.params.tourid;

    const sqlQuery = 'select team_name,id from team where tour_id=?';
    const rows = await pool.query(sqlQuery, tour_id);

    const query = 'select * from matches where tour_id=?';
    const result = await pool.query(query, tour_id);

    res.render('addmatch', { tourid: tour_id, row: rows, matches: result });
})


app.get('/viewtournament', isLoggedin ,async (req, res) => {

    const sqlQuery = 'select * from tournament';
    const rows = await pool.query(sqlQuery);


    res.render('viewtourney', { tourinfo: rows });
})

app.get('/viewtournament/:tourid', isLoggedin ,async (req, res) => {
    let tour_id = req.params.tourid;

    const sqlQuery = 'select * from matches where tour_id=?';
    const rows = await pool.query(sqlQuery, tour_id);

    res.render('viewmatches', { matchinfo: rows, tourid: tour_id });
})

app.get('/viewtournament/:tourid/:matchid', isLoggedin , async (req, res) => {
    let match_id = req.params.matchid;
    let tour_id = req.params.tourid;

    res.redirect(`/match/${match_id}/commentary`);

})

app.get('/viewtournament/:tourid/:matchid/updatescore', isLoggedin ,async (req, res) => {
    let match_id = req.params.matchid;
    let tour_id = req.params.tourid;
    let isadmin = false;
    if(req.session.name == 'admin12345'){
        isadmin = true;
    }

    const sqlQuery = 'select * from matches where match_id=?';
    const rows = await pool.query(sqlQuery, match_id);

    const score_query = 'select * from scorecard where match_id=?';
    const score_result = await pool.query(score_query, match_id);

    const player1query = 'select * from player where team_id=?'
    const players1 = await pool.query(player1query, rows[0].team1_id);

    const player2query = 'select * from player where team_id=? '
    const players2 = await pool.query(player2query, rows[0].team2_id);

    res.render('updatescore', { row: rows, team1: players1, team2: players2 , matchid : match_id , admin : isadmin , tourid : tour_id , scorecard : score_result});



})

app.listen(8000, (req, res) => {
    console.log('Listening on Port 8000 . . .');
});


