// Keep tunnel running forever with auto-restart
const { spawn } = require('child_process');

let tunnelProcess = null;

const startTunnel = () => {
  console.log('🔄 Starting tunnel...');
  
  tunnelProcess = spawn('ssh', [
    '-R', '80:localhost:3000',
    'serveo.net',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30'
  ]);

  tunnelProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[\w-]+\.serveo\.net/);
    if (urlMatch) {
      console.log('\n🌐 YOUR URL:', urlMatch[0]);
      console.log('📋 COPY AND SHARE THIS URL!\n');
    }
  });

  tunnelProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  tunnelProcess.on('close', (code) => {
    console.log(`⚠️  Tunnel closed (code ${code}). Restarting in 5 seconds...`);
    setTimeout(() => {
      startTunnel();
    }, 5000);
  });
};

// Start tunnel
startTunnel();

// Keep process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down tunnel...');
  if (tunnelProcess) {
    tunnelProcess.kill();
  }
  process.exit();
});

