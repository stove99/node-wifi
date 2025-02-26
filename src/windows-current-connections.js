const execFile = require('child_process').execFile;
const env = require('./env');
const networkUtils = require('./utils/network-utils.js');
const iconv = require('iconv-lite');
const decode = require('urldecode');

function parseShowInterfaces(stdout) {
  const lines = stdout.split('\r\n');
  const connections = [];
  let i = 3;
  while (lines.length > i + 18) {
    const tmpConnection = {};
    const fields = [
      'name',
      'description',
      'guid',
      'mac',
      'state',
      'ssid',
      'bssid',
      'mode',
      'radio',
      'authentication',
      'encryption',
      'connection',
      'channel',
      'reception',
      'transmission',
      'signal',
      'profil'
    ];
    for (let j = 0; j < fields.length; j++) {
      const line = lines[i + j];
      tmpConnection[fields[j]] = line.match(/.*: (.*)/)[1];
    }

    const isHex = networkUtils.isHex(tmpConnection.ssid);
    if (isHex) {
      try {
        const chunked = networkUtils.chunk(tmpConnection.ssid.split(''), 2);
        const encoded = '%' + chunked.map(c => c.join('')).join('%');
        tmpConnection.ssid = decode(encoded);
      } catch {}
    }

    connections.push({
      iface: tmpConnection.name,
      ssid: tmpConnection.ssid,
      bssid: tmpConnection.bssid,
      mac: tmpConnection.bssid,
      mode: tmpConnection.mode,
      channel: parseInt(tmpConnection.channel),
      frequency: parseInt(
        networkUtils.frequencyFromChannel(parseInt(tmpConnection.channel))
      ),
      signal_level: networkUtils.dBFromQuality(tmpConnection.signal),
      quality: parseFloat(tmpConnection.signal),
      security: tmpConnection.authentication,
      security_flags: tmpConnection.encryption
    });

    i = i + 18;
  }

  return connections;
}

function getCurrentConnection(config, callback) {
  const params = ['wlan', 'show', 'interfaces'];
  execFile('netsh', params, { env, encoding: 'binary' }, (err, stdout) => {
    if (err) {
      callback && callback(err);
    } else {
      try {
        const connections = parseShowInterfaces(
          iconv.decode(stdout, 'euc-kr'),
          config
        );
        callback && callback(null, connections);
      } catch (e) {
        callback && callback(e);
      }
    }
  });
}

module.exports = config => {
  return callback => {
    if (callback) {
      getCurrentConnection(config, callback);
    } else {
      return new Promise((resolve, reject) => {
        getCurrentConnection(config, (err, connections) => {
          if (err) {
            reject(err);
          } else {
            resolve(connections);
          }
        });
      });
    }
  };
};
