# processKiller

processKiller is a simple Node.js script that provides a command-line interface to terminate processes running on your system based on their names.

## Installation

To use processKiller, you need to have Node.js installed on your system. If you don't have Node.js installed, you can download it from the official website: https://nodejs.org/

To install processKiller, follow these steps:

1. Clone this repository to your local machine or download the ZIP archive and extract it.
2. Open a terminal or command prompt and navigate to the project directory.
3. Run the following command to install the required dependencies:

```bash
npm install
```

## Usage

To use processKiller, open a terminal or command prompt and navigate to the project directory. Then, run the script using Node.js followed by the desired process name.

The basic syntax for using processKiller is as follows:

```bash
node process.js 
```


## Example

To terminate all processes with the name "chrome," run the following command:
```bash
node process.js chrome
```

This will attempt to terminate all processes with the name "chrome."

## Disclaimer

Use processKiller responsibly and with caution. Terminating processes can result in data loss or system instability. Make sure you understand the consequences of killing a process before using this tool. The author of processKiller is not responsible for any misuse or damage caused by the script.
