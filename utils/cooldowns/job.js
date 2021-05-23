const lang = require('../../../lang/en_US.json');
const config = require('../../../config/config.json');
const configonoff = require('../../../config/onoff.json');
const chalk = require('chalk');
const Math = require('mathjs');
const fs = require('fs');

var moment = require('moment');
// const zeroPad = (num, places) => String(num).padStart(places, '0')
var timeNow = moment.utc().format('MM/DD/YYYY-hh:mm:ss-a');
const zeroPad = (num, places) => String(num).padStart(places, '0')
require('dotenv').config();

module.exports = (client, message, args, Discord) => {
    //const member = message.member
    // const profileData = `./db/cooldown/${member.id}.json`;
    var cooldowninterval
    client.on('ready', () => {
        cooldowninterval = setInterval(() => {
            try {
                // if(fs.existsSync(configonoff)) {
                //     let rawdata = fs.readFileSync(profileData);
				// 	let onoffread = JSON.parse(rawdata);
                // if (onoffread.cooldown === true) {
                    // make Promise version of fs.readdir()
                    fs.readdirAsync = function(dirname) {
                        return new Promise(function(resolve, reject) {
                            fs.readdir(dirname, function(err, filenames){
                                if (err) 
                                    reject(err); 
                                else 
                                    resolve(filenames);
                            });
                        });
                    };

                    // make Promise version of fs.readFile()
                    fs.readFileAsync = function(filename, enc) {
                        return new Promise(function(resolve, reject) {
                            fs.readFile(`./db/cooldown/${filename}`, enc, function(err, data){
                                const profileData = `./db/economy/profiles/${filename}`;
                                let rawdata = fs.readFileSync(profileData);
                                let profiledataread = JSON.parse(rawdata);
                                if (err) 
                                    reject(err); 
                                else
                                    resolve(data);
                                    switch (1) {
                                        case 1:
                                            let cooldownjobread = JSON.parse(data);
                                            // console.log(cooldowndataread.cooldown);
                                            // moment.utc(member.joinedTimestamp).add(1, 'hours').format('MM/DD/YYYY-hh:mm:ss-a')
                                            let cooldownjob = cooldownjobread.cooldown.job;
                                            let jobmembername = cooldownjobread.member.displayName
                                            if (timeNow < cooldownjob) {
                                                // console.log('Time is over')
                                                let cooldownjobwrite = {
                                                    dbNumber: cooldownjobread.dbNumber,
                                                    version: cooldownjobread.version,
                                                    member: cooldownjobread.member,
                                                    cooldown: {
                                                        newjoin: cooldownjobread.cooldown.newjoin,
                                                        gamble: cooldownjobread.cooldown.gamble,
                                                        job: "01/01/2121-00:01:00-am",
                                                    }
                                                };
                                                let datacooldownjob = JSON.stringify(cooldownjobwrite, null, 2);
                                                fs.writeFileSync(`./db/cooldown/${filename}`, datacooldownjob, function (err){
                                                    if (err) throw err;
                                                    console.log(chalk.cyan('[' + moment.utc().format('MM/DD/YYYY-h:mm:ss-A') + ']' + lang.prefix.royal, err));
                                                });
                                                let worktokenwrite = { 
                                                    dbNumber: profiledataread.dbNumber,
                                                    version: profiledataread.version,
                                                    member: profiledataread.member,
                                                    coins: profiledataread.coins,
                                                    gamble: profiledataread.gamble,
                                                    job: {
                                                        hasjob: profiledataread.hasjob,
                                                        jobs: profiledataread.jobs,
                                                        jobexp: profiledataread.jobexp,
                                                        jobworked: 5
                                                    },
                                                    experience: profiledataread.experience,
                                                    inventory: profiledataread.inventory
                                                };
                                                let datacount = JSON.stringify(worktokenwrite, null, 2);
                                                fs.writeFileSync(profileData, datacount);
                                                console.log(chalk.cyan('[' + moment.utc().format('MM/DD/YYYY-h:mm:ss-A') + ']' + lang.prefix.royal, `Job Cooldown of '${jobmembername}' is resetted.`));
                                            } else {
                                                return;
                                            };
                                    }
                            });
                        });
                    };

                    // utility function, return Promise
                    function getFile(filename) {
                        return fs.readFileAsync(filename, 'utf8');
                    }

                    // example of using promised version of getFile
                    // getFile(filename, 'utf8').then(function (data){
                    // console.log(data);
                    // });


                    // a function specific to my project to filter out the files I need to read and process, you can pretty much ignore or write your own filter function.
                    function isDataFile(filename) {
                        return (filename.split('.')[1] == 'json')
                    }

                    
                    // start a blank fishes.json file
                    // fs.writeFile('./fishes.json', '', function(){console.log('done')});


                    // read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed.
                    fs.readdirAsync('./db/cooldown').then(function (filenames){
                        filenames = filenames.filter(isDataFile);
                        //console.log(filenames);
                        return Promise.all(filenames.map(getFile));
                    })
                    // .then(function (files){
                    //     var summaryFiles = [];
                    //     files.forEach(function(file) {
                    //     var json_file = JSON.parse(file);
                    //     summaryFiles.push({ "name": json_file["name"],
                    //                         "imageUrl": json_file["images"][0],
                    //                         "id": json_file["id"]
                    //                     });
                    //     });
                    //     fs.appendFile("./fishes.json", JSON.stringify(summaryFiles, null, 4), function(err) {
                    //         if(err) {
                    //         return console.log(err);
                    //         }
                    //         console.log("The file was appended!");
                    //     });
                    // });
                // };
                // };
            }catch(error){
                console.log(error)
            }
        }, 10000);
    })
}