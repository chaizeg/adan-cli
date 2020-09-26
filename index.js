#!/usr/bin/env node

const request = require('request');
const Table = require('cli-table3');
const config = require('./config');
const readlineSync = require('readline-sync');
 

//ask user for city
function registerCity(){
  var city = "";
  do{
    city = readlineSync.question('Where do you live? ');
  }while(city=="");
  console.log(`Alright so you live in ${city}. Looking up prayer times in ${city}..\n\n\n`);
  config.CITY = city;
  config.API_URL += "&city="+config.CITY;
};


//details of GET request sent to prayer times API
function adanRequest(){
  const options = {
    url: config.API_URL,
    method: 'GET'
  };
  request(options, (err, res, body) => {
  if (err) {
      return false;
  }
  if(body.length == 0) {
    console.log(`${config.CITY} doesn't exist..`);
    return false;
  }
  var val = JSON.parse(body);
  if(typeof val === undefined){
    console.log(`${config.CITY} doesn't exist..`);
    return false;
  }
  else{
    val = val.results.datetime[0].times;
    var times = [];
    var values = [];
    for(var j in val){
      var sub_key = j;
      times.push(sub_key);
      var sub_val = val[j];
      values.push(sub_val);
    }
    // Create table for prayer times :D
    var table = new Table({
      head: times,
    });
    table.push(values);
    console.log(`Below are the prayer times in ${config.CITY}: \n `);
    console.log(table.toString());
    return true;
  }
})
};

//main adan-cli function
function main(){
  console.log("Welcome to Chai's CLI tool to show you prayer times in your city (｡◕‿‿◕｡)\n\n");
  registerCity();
  adanRequest();
};

main();
