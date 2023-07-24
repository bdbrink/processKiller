const { exec } = require("child_process");

function getProcessList() {
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

getProcessList();
