const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db_name = path.join(__dirname, 'data', 'nmap.db');

/* eslint-disable consistent-return, no-console, no-unused-vars */
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Successful connection to the database \'nmap.db\'');
});
/* eslint-enable consistent-return, no-console, no-unused-vars */

module.exports = db;
