const { exec } = require('child_process');

function getProcessList() {
  const command = 'ps aux';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }

    console.log('Running Processes:');
    console.log(stdout);
  });
}

getProcessList();
