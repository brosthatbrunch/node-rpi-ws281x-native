var ws281x = require('../lib/ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 10;
var GPIO = parseInt(process.argv[3], 10) || 18;

const channel = ws281x(10, { dma: 10, gpio: GPIO, brightness: 100 });
const pixelData = channel.array;


// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  ws281x.finalize();
  process.nextTick(function () { process.exit(0); });
});


// ---- animation-loop
var offset = 0;

setInterval(function () {
  for (var i = 0; i < 5; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }
  offset = (offset + 1) % 256;
  ws281x.render();
}, 1000 / 100);

console.log('Press <ctrl>+C to exit.');


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
