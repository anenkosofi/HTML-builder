const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'));

rs.on('data', (chunk) => {
  console.log(`${chunk}`);
});

rs.on('end', () => {
  console.log('File reading completed.');
});
