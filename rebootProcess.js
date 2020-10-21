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
                    if (process.arguments[0] == argv.name) {
                        console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments)
                        let processPID = process.pid
                        exec(`pwdx ${processPID}`, (err, stdout, stderr) => {
                            if (err) {
                                console.error(err)
                            } else {
                                if (stderr) console.log(stderr)
                                let path = stdout.split(": ")[1]

                                exec(`kill -9 ${processPID}`, (err, stdout, stderr) => {
                                    if (err) {
                                        console.error(err)
                                    } else {
                                        if (stderr) console.log(stderr)
                                        console.log("Process shuted down.")
                                    }
                                });

                                let command = `node ${path.trim()}/${argv.name}`
                                exec(command, (err, stdout, stderr) => {
                                    if (err) {
                                        console.error(err)
                                    } else {
                                        if (stderr) console.log(stderr)
                                        console.log("Process started again.")
                                    }
                                });
                            }
                        });    
                    } else {
                        console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments)
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
