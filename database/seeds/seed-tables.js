const db = require('..');

const sql_insert = `INSERT INTO Hosts (Host_ID, IP, HOSTNAME) VALUES
  (1, '81.107.115.203', 'cpc123026-glen5-2-0-cust970.2-1.cable.virginm.net'),
  (2, '158.69.205.102', 'nicholas.cybershark.net'),
  (3, '193.22.92.195', 'loghermes.sysraildata.com');`;

/* eslint-disable no-console, consistent-return */
module.exports = db.run(sql_insert, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Successful seed of the \'Hosts\' table');
}).close();
/* eslint-disable no-console, consistent-return */
