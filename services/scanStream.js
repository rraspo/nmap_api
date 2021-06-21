const stream = require('stream');
const db = require('../database');

const scanStream = new stream.Writable();

/* eslint-disable func-names, no-console */
scanStream._write = function (line) {
  const lines = line.toString().split('\n');
  const dateRegex = /(Jan?|Feb?|Mar?|Apr?|May?|Jun?|Jul?|Aug?|Sep?|Oct?|Nov?|Dic?) (\d)+ (?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d) (\d)+/;
  const scanDate = dateRegex.exec(lines[0])[0].trim();
  console.log(scanDate);
  for (let index = 3; index < lines.length; index += 2) {
    const line = lines[index];
    if (line.charAt(0) !== '#') {
      const ipRegex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
      const ip = ipRegex.exec(line);
      const portsData = [];
      const portsRaw = line.split('Ports:');
      portsRaw.forEach((portRaw) => (
        portRaw.split(',').forEach((port) => {
          const portRegex = /(.[0-9]+)/;
          const portData = portRegex.exec(port);
          const statusRegex = /([a-zA-Z]+)/;
          const statusData = statusRegex.exec(port);
          const protocolRegex = /(?<=\/)[a-zA-Z]+(?=\/\/)/;
          const protocolData = protocolRegex.exec(port);
          const connProtocolRegex = /(?<=\/\/)([\w-]+|[a-zA-Z]+)(?=\/\/\/)/;
          const connProtocolData = connProtocolRegex.exec(port);
          if (portData && statusData && protocolData && connProtocolData) {
            portsData.push({
              port: portData ? portData[0].trim() : null,
              status: statusData ? statusData[0] : null,
              transport: protocolData ? protocolData[0] : null,
              protocol: connProtocolData ? connProtocolData[0] : null
            });
          }
        })
      ));
      if (ip) {
        const scanObj = {
          ip: ip[0],
          ports: portsData
        };
        let hostId = null;
        db.exec(`INSERT INTO Hosts (IP) VALUES ('${scanObj.ip}')`, (err) => {
          console.log(`L46:${err}`);
        });
        db.all(`SELECT ID FROM Hosts WHERE IP = '${scanObj.ip}';`, (err, rows) => {
          console.log(`L74:${err}`);
          if (!err && rows) {
            hostId = rows[0].ID;
            scanObj.ports.forEach((port) => {
              db.exec(`INSERT INTO Scans (PORT, STATUS, TRANSPORT, PROTOCOL, SCAN_DATE, Host_ID) 
                      VALUES (${port.port}, '${port.status}', '${port.transport}', '${port.protocol}', '${scanDate}', ${hostId});
              `, (err) => console.log(`L55:${err}`));
            });
          }
        });
      }
    }
  }
  return lines;
};

scanStream.on('error', (err) => console.log(`L64:${err}`));
/* eslint-enable func-names, no-console */

module.exports = scanStream;
