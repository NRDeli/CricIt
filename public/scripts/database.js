const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'Nirmit-Vostro',
    user: 'nirmit',
    password: 'chiku',
    database: 'cricit',
    connectionLimit: 5
});

// Connect and check for errors
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connection');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }
    if (connection) connection.release();

    return;
});

module.exports = pool;



// const express = require('express');
// const router = express.Router();
// const pool = require('../helpers/database');
// const bcrypt = require('bcrypt');


// router.get('/:id', async function(req,res){
//     try {
//         const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?';
//         const rows = await pool.query(sqlQuery, req.params.id);
//         res.status(200).json(rows);
//     } catch (error) {
//         res.status(400).send(error.message)
//     }


//     res.status(200).json({id:req.params.id})
// });

// router.post('/register', async function(req,res) {
//     try {
//         const {email, password} = req.body;

//         const encryptedPassword = await bcrypt.hash(password,10)

//         const sqlQuery = 'INSERT INTO user (email, password) VALUES (?,?)';
//         const result = await pool.query(sqlQuery, [email, encryptedPassword]);

//         res.status(200).json({userId: result.insertId});
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

// router.post('/login', async function(req,res) {
//     try {
//         const {id,password} = req.body;

//         const sqlGetUser = 'SELECT password FROM user WHERE id=?';
//         const rows = await pool.query(sqlGetUser,id);
//         if(rows){

//             const isValid = await bcrypt.compare(password,rows[0].password)
//             res.status(200).json({valid_password: isValid});
//         }
//         res.status(200).send(`User with id ${id} was not found`);

//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

// module.exports = router;