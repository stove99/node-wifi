const channels = {};

// cf [wlan channels frequency](https://en.wikipedia.org/wiki/List_of_WLAN_channels)

let frequency = 2412;

for (let i = 1; i < 15; i++) {
  channels[i] = frequency.toString();
  frequency = frequency + 5;
}

frequency = 5180;

for (let j = 36; j <= 64; j += 2) {
  channels[j] = frequency.toString();
  frequency += 10;
}

frequency = 5500;

for (let k = 100; k <= 144; k += 2) {
  channels[k] = frequency.toString();
  frequency += 10;
}

frequency = 5745;

for (let l = 149; l <= 161; l += 2) {
  channels[l] = frequency.toString();
  frequency += 10;
}

frequency = 5825;

for (let m = 165; m <= 173; m += 4) {
  channels[m] = frequency.toString();
  frequency += 20;
}

function frequencyFromChannel(channelId) {
  return channels[parseInt(channelId)];
}

function dBFromQuality(quality) {
  return parseFloat(quality) / 2 - 100;
}

function qualityFromDB(db) {
  return 2 * (parseFloat(db) + 100);
}

const hexReg = /^[0-9a-fA-F]+$/gm;
function isHex(str) {
  return hexReg.test(str);
}

function chunk(array, size) {
  const chunked = [];
  let index = 0;

  while (index < array.length) {
    chunked.push(array.slice(index, index + size));
    index += size;
  }

  return chunked;
}

exports.frequencyFromChannel = frequencyFromChannel;
exports.dBFromQuality = dBFromQuality;
exports.qualityFromDB = qualityFromDB;
exports.isHex = isHex;
exports.chunk = chunk;
