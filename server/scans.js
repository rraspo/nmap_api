const express = require('express');
// var ScanStream = require('../services/scanStream');

const router = express.Router();
const db = require('../database');
const fs = require('fs');

var stream = require('stream');
var util = require('util');

function ScanStream () {
  stream.Writable.call(this);
}

util.inherits(ScanStream, stream.Writable);

ScanStream.prototype._write = (chunk, encoding, done) => {
  var data = chunk.toString();
  parseline(data);
  // console.log(chunk.toString());
  done();
};

function parseline(line) {
  var lines = line.split('\n');
  var dateRegex = /(Jan?|Feb?|Mar?|Apr?|May?|Jun?|Jul?|Aug?|Sep?|Oct?|Nov?|Dic?) (\d)+ (?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d) (\d)+/;
  var scanDate = dateRegex.exec(lines[0])[0].trim();
  console.log(scanDate);
  for (let index = 3; index < lines.length; index+=2) {
    const line = lines[index];
    if(line.charAt(0) != '#') {
      var ipRegex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
      var ip = ipRegex.exec(line);
      var portsData = [];
      var portsRaw = line.split('Ports:');
      portsRaw.forEach(portRaw => (
        portRaw.split(',').forEach(port => {
          var portRegex = /(.[0-9]+)/;
          var portData = portRegex.exec(port);
          var statusRegex = /([a-zA-Z]+)/;
          var statusData = statusRegex.exec(port);
          var protocolRegex = /(?<=\/)[a-zA-Z]+(?=\/\/)/;
          var protocolData = protocolRegex.exec(port);
          var connProtocolRegex = /(?<=\/\/)([\w\-]+|[a-zA-Z]+)(?=\/\/\/)/;
          var connProtocolData = connProtocolRegex.exec(port);
          if(portData && statusData && protocolData && connProtocolData) {
            portsData.push({
              port: portData ? portData[0].trim() : null,
              status: statusData ? statusData[0] : null,
              transport: protocolData ? protocolData[0] : null,
              protocol: connProtocolData ? connProtocolData[0] : null
            });
          }
        })
      ))
      if (ip) {
        var scanObj = {
          ip: ip[0],
          ports: portsData
        };
        var hostId = null;
        db.exec(`INSERT INTO Hosts (IP) VALUES ('${scanObj.ip}')`, (err) => {
          console.log('L71:' + err);
        });
        db.all(`SELECT ID FROM Hosts WHERE IP = '${scanObj.ip}';`, (err, rows) => {
          console.log('L74:' + err);
          if(!err && rows) {
            hostId = rows[0].ID
            scanObj.ports.forEach(port => {
              db.exec(`INSERT INTO Scans (PORT, STATUS, TRANSPORT, PROTOCOL, SCAN_DATE, Host_ID) 
                      VALUES (${port.port}, '${port.status}', '${port.transport}', '${port.protocol}', '${scanDate}', ${hostId});
              `, (err) => console.log('L80:' + err));
            });
          };
        });
      }
    }
  }
  return lines;
}


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
      var scanStream = new ScanStream();
      fs.createReadStream(`./uploads/${scan.name}`).pipe(scanStream);
      res.send('Processed');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
/* eslint-enable consistent-return, no-console */

module.exports = router;
