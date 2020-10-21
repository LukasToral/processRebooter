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


    if (argv._.includes('rbp')) {
        ps.lookup({
            command: 'node'
        }, function (err, resultList) {
            if (err) {
                throw new Error(err);
            }

            resultList.forEach(function (process) {
                if (process) {
                    // For case when name of the script entered by user is found more than once in the process list
                    let length = 0
                    if (process.arguments[0] == argv.name) {
                        console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments)
                        length++
                    }
                    if (length > 1) {
                        console.log("---Caution---")
                        console.log("There is more than one process started by the script name you have entered. Please enter PID of the process you would like to reboot:")
                        let processPID = parseInt(readline())
                    } else if (length === 1) {
                        let processPID = process.pid
                        exec(`pwdx ${processPID}`, (err, stdout, stderr) => {
                            if (err) {
                                console.error(err)
                            } else {
                                if (stderr) console.log(stderr)
                                let path = stdout.split(": ")[1]
                                exec(`node ${path}/${argv.name}`, (err, stdout, stderr) => {
                                    if (err) {
                                        console.error(err)
                                    } else {
                                        if (stderr) console.log(stderr)
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
    
/* if (argv._.includes('lyr')) {
    const year = argv.year || new Date().getFullYear();
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
        console.log(`${year} is a Leap Year`);
    } else {
        console.log(`${year} is NOT a Leap Year`);
    }
} */
