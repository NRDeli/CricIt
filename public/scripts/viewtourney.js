const pool = require('./database');

async function getTourneys(){
    const sqlQuery = 'select * from tournament'
    const result = await pool.query()
}