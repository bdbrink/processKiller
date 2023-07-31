const { exec } = require("child_process");

function getProcessList() {
  console.time("Execution Time"); // Start the timer

  // Get the process name(s) from command-line arguments
  const processNames = process.argv.slice(2);

  // Validate if process names are provided
  if (processNames.length === 0) {
    console.error(
      "Please provide one or more process names as command-line arguments."
    );
    return;
  }

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

    // Find malicious processes based on provided process names
    const maliciousProcesses = findMaliciousProcesses(stdout, processNames);
    console.log("Malicious Processes:");
    console.log(maliciousProcesses);

    // Kill the malicious processes with dry run option (true/false)
    //killMaliciousProcesses(maliciousProcesses, true);

    // Get time it takes to execute
    console.timeEnd("Execution Time");
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
  console.log("Killing Processes:");
  if (processes.length === 0) {
    console.log("No unused processes to kill.");
    return;
  }

  if (dryRun) {
    processes.forEach((process) => {
      console.log(
        `(Dry Run) Killing PID ${process.pid}, Command: ${process.command}`
      );
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

function findMaliciousProcesses(psOutput, blacklist) {
  const lines = psOutput.split("\n").slice(1);
  const maliciousProcesses = [];

  for (const line of lines) {
    const [command] = line.trim().split(/\s+/);

    // Check if the command matches any entry in the blacklist
    for (const maliciousProcess of blacklist) {
      if (command.includes(maliciousProcess)) {
        maliciousProcesses.push(command);
        break;
      }
    }
  }

  return maliciousProcesses;
}

function killMaliciousProcesses(processes, dryRun) {
  console.log("Killing Malicious Processes:");
  if (processes.length === 0) {
    console.log("No malicious processes to kill.");
    return;
  }

  if (dryRun) {
    processes.forEach((process) => {
      console.log(`(Dry Run) Killing Process: ${process}`);
    });
  } else {
    processes.forEach((process) => {
      exec(`pkill ${process}`, (error) => {
        if (error) {
          console.error(`Error killing process ${process}: ${error.message}`);
          return;
        }
        console.log(`Killed Process: ${process}`);
      });
    });
  }
}

getProcessList();
