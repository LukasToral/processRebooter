const yargs = require('yargs');
const ps = require('ps-node');
const { exec } = require("child_process");

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

    ps.lookup({
        command: 'node',
        psargs: 'ux'
    }, function (err, resultList) {
        if (err) {
            throw new Error(err);
        }

        resultList.forEach(function (process) {

            process.arguments.forEach((arg) => {
                if (arg.indexOf(argv.name) !== -1) {
                    let pid = process.pid

                    let command = `pwdx ${pid}`
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });

                    console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
                } else {
		    console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
		}
            })
        });
    });
/* if (argv._.includes('lyr')) {
    const year = argv.year || new Date().getFullYear();
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
        console.log(`${year} is a Leap Year`);
    } else {
        console.log(`${year} is NOT a Leap Year`);
    }
} */
