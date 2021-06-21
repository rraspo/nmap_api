const db = require('..');

const create_hosts_table = `
  CREATE TABLE IF NOT EXISTS Hosts (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    IP VARCHAR(100) NOT NULL UNIQUE
  );`;

const create_scans_table = `
  CREATE TABLE IF NOT EXISTS Scans (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PORT INTEGER NOT NULL,
    STATUS VARCHAR(100) NOT NULL,
    TRANSPORT VARCHAR(100) NOT NULL,
    PROTOCOL VARCHAR(100) NOT NULL,
    SCAN_DATE VARCHAR(22) NOT NULL,
    Host_ID INTEGER NOT NULL,
    FOREIGN KEY (Host_ID) REFERENCES Hosts (ID),
    UNIQUE(Host_ID, PORT, STATUS, SCAN_DATE)
  );`;

/* eslint-disable no-console, consistent-return */
module.exports = (() => {
  db.run(create_hosts_table, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Successful creation of the \'Hosts\' table.');
  });
  db.run(create_scans_table, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Successful creation of the \'Scans\' table.');
  }).close();
})();
/* eslint-enable no-console, consistent-return */
