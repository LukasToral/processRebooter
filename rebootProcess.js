const yargs = require('yargs');
const ps = require('ps-node');
const { exec } = require("child_process");
const readline = require('readline');

const argv = yargs
    .command('rbp', 'Reboots running proccess', {
        name: {
            description: 'the name of the proccess',
            alias: 'n',
            type: 'string',
            demand: true,
            demand: 'process name is required'
        },
        cron: {
            description: 'sets how often should be the proccess rebooted',
            alias: 'c',
            type: 'string',
            demand: true,
            demand: 'cron is required'
        }
    })
    .showHelpOnFail(true, "Specify --help for available options")
    .help()
    .alias('help', 'h')
    .argv;

    
    function startScript (scriptName) {
        let command = `nohup node ${scriptName} &`

        ps.lookup({
            command: 'node',
            arguments: `${scriptName}`,
        },
            function (err, resultList) {
                if (err) {
                    throw new Error(err);
                }
                // check if the same process already running:
                if (resultList.length > 1) {
                    console.log('This script is already running.');
                    // Get the PID of running script
                    exec(`pgrep - f 'node ./${scriptName}'`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                        } else {
                            if (stderr) console.log(stderr)
                            console.log("process is running", stdout)
                            let scriptPID = stdout
                        }
                    });
                }
                else {
                    let command = `nohup node ${scriptName} &`
                    exec(command, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                        } else {
                            if (stderr) console.log(stderr)
                            exec(`pgrep - f 'node ./${scriptName}'`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(err)
                                } else {
                                    if (stderr) console.log(stderr)
                                    console.log("process is running", stdout)
                                    let scriptPID = stdout
                                }
                            });
                        }
                    });
                }
            });
    }

    if (argv._.includes('rbp')) {
        startScript(argv.name)
    }
    
/* if (argv._.includes('lyr')) {
    const year = argv.year || new Date().getFullYear();
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
        console.log(`${year} is a Leap Year`);
    } else {
        console.log(`${year} is NOT a Leap Year`);
    }
} */
