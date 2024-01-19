const fs = require('fs');
const path = require('path');
const readline = require('readline');

const outputStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {
  flags: 'a',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter text:\n',
});

console.log('Welcome! Type "exit" or press Ctrl+C to terminate.');

rl.prompt();

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye! Terminating the process.');
    rl.close();
  } else {
    outputStream.write(`${input}\n`);
    rl.prompt();
  }
});

rl.on('close', () => {
  outputStream.end();
  process.exit(0);
});

rl.on('SIGINT', () => {
  console.log('\nReceived SIGINT (Ctrl+C). Terminating the process.');
  rl.close();
});
