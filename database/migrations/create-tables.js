const db = require ('../../database');
const sql_create = `CREATE TABLE IF NOT EXISTS Hosts (
  Host_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  IP VARCHAR(100) NOT NULL,
  HOSTNAME VARCHAR(100)
);`;

console.log(db);

module.exports = db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Successful creation of the \'Hosts\' table');
});
