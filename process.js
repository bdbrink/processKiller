const { exec } = require("child_process");

function getProcessList() {
    console.time('Execution Time'); // Start the timer
    const command = "ps aux";

    exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }

    console.log("Running Processes:");
    console.log(stdout);

    // Add the users you want to exclude here
    const excludeUsers = ["root", "e143608"];
    const unusedProcesses = findUnusedProcesses(stdout, excludeUsers);
    console.log("Unused Processes:");
    console.log(unusedProcesses);

    // Kill the unused processes with dry run option (true/false)
    killUnusedProcesses(unusedProcesses, true);
    
    // get time it takes to excute
    console.timeEnd('Execution Time');
    });
}

function findUnusedProcesses(psOutput, excludeUsers) {
  // Remove the header line
  const lines = psOutput.split("\n").slice(1);

  const unusedProcesses = [];
  for (const line of lines) {
    const [user, pid, cpu, mem, command] = line.trim().split(/\s+/);

    // Check conditions to consider a process as unused (you can modify these conditions as per your requirement)
    const isUnused =
      cpu === "0.0" &&
      mem === "0.0" &&
      !excludeUsers.includes(user) &&
      !command.includes("ps aux");

    if (isUnused) {
      unusedProcesses.push({
        user,
        pid,
        cpu,
        mem,
        command,
      });
    }
  }

  return unusedProcesses;
}

function killUnusedProcesses(processes, dryRun) {
    console.log('Killing Processes:');
    if (processes.length === 0) {
      console.log('No unused processes to kill.');
      return;
    }
  
    if (dryRun) {
      processes.forEach((process) => {
        console.log(`(Dry Run) Killing PID ${process.pid}, Command: ${process.command}`);
      });
    } else {
      processes.forEach((process) => {
        exec(`kill ${process.pid}`, (error) => {
          if (error) {
            console.error(`Error killing PID ${process.pid}: ${error.message}`);
            return;
          }
          console.log(`Killed PID ${process.pid}, Command: ${process.command}`);
        });
      });
    }
  }

getProcessList();
