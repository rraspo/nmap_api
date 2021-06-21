const express = require('express');
const fs = require('fs');
const scanStream = require('../services/scanStream');

const router = express.Router();
const db = require('../database');

/* eslint-disable consistent-return, no-console */
router.get('/scans', (req, res, next) => {
  const sql = `
    SELECT Scans.ID as SCAN_ID, PORT, STATUS, TRANSPORT, PROTOCOL, Hosts.ID, Hosts.IP
    FROM Scans LEFT JOIN Hosts ON Hosts.ID = Scans.Host_ID
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    rows.forEach((row) => console.log(row));
    res.send(rows);
  });
});

router.post('/scans', async (req, res, next) => {
  try {
    if (!req.files) {
      res.send({
        success: false,
        message: 'No file uploaded'
      });
    } else {
      const { scan } = req.files;
      scan.mv(`./uploads/${scan.name}`);
      // var scanStream = new ScanStream();
      fs.createReadStream(`./uploads/${scan.name}`).pipe(scanStream);
      res.send('Processed');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
/* eslint-enable consistent-return, no-console */

module.exports = router;
