const db = require('..');

const sql_create = `CREATE TABLE IF NOT EXISTS Hosts (
  Host_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  IP VARCHAR(100) NOT NULL,
  HOSTNAME VARCHAR(100)
);`;

/* eslint-disable no-console, consistent-return */
module.exports = db.run(sql_create, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Successful creation of the \'Hosts\' table');
}).close();
/* eslint-enable no-console, consistent-return */
