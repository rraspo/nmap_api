const express = require('express');

const router = express.Router();
const db = require('../database');
const xml2js = require('xml2js');

/* eslint-disable consistent-return, no-console */
router.get('/scans', (req, res, next) => {
  const sql = 'SELECT * FROM Hosts';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    rows.forEach((row) => console.log(row));
    res.send(rows);
  }).close();
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
      console.log(req.files);
      xml2js.parseString(scan.data, (err, parsedXML) => {
        if (err) { throw err; }
        const json = JSON.stringify(parsedXML, null, 4);
        res.send(json);
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
/* eslint-enable consistent-return, no-console */

module.exports = router;
