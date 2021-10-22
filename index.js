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

app.post('/checksign', (req, res) => {
    const email = req.body.first_name;
    console.log(email)
    // try {
    //     //const {email, password} = req.body;

    //     //const encryptedPassword = await bcrypt.hash(password,10)

    //     const sqlQuery = 'INSERT INTO player (id, username, password, email) VALUES (?,?,?,?)';
    //     const result = await pool.query(sqlQuery, [1, username, password, email]);

    //     res.status(200).json({ userId: result.insertId });
    // } catch (error) {
    //     res.status(400).send(error.message)
    // }
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