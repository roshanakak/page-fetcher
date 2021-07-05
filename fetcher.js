'use strict;';
const fs = require('fs');
const request = require('request');
const readline = require('readline');

const readlineObj = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const URL = process.argv[2];
const filePath = process.argv[3];


const fileSize = (path) => {
  const stats = fs.statSync(path);
  console.log(`Downloaded ${stats.size} bytes to ${path}`);
};

const writeFile = (data, path, callback) => {
  fs.writeFile(path, data, (error) => {
    if (error) return callback(error,null);
    return callback(null, 'File saved!');
  });
};

const fileExists = (path, callback) => {
  fs.stat(path, (error, stats) => {
    if (error) {
      if (error.code === 'ENOENT') return callback(null, false);
      else return callback(error, null);
    }
    callback(null, stats.isFile());
  });
};

const retreiveData = (readlineObj, callback) => {
  request(readlineObj, (error, resp, body) => {
    if (error) return callback(error,null);
    if (resp.statusCode !== 200) {
      return callback(Error(`Status Code ${resp.statusCode} when fetching page. Response: ${body}`), null);
    }
    callback(null, body);
  });
};

const download = (callback) => {
  retreiveData(URL, (error, data) => {
    if (error) return callback(error, null);

    fileExists(filePath, (error, exists) => {
      if (error) return callback(error, null);

      if (exists) {
        writeFile(data, filePath, (error, success) => {
          if (error) return callback(error, null);
          else fileSize(filePath);
        });
      } else {
        writeFile(data, filePath, (error, success) => {
          if (error) return callback(error, null);
          else fileSize(filePath);
        });
      }
    });
  });
  readlineObj.close();
};

download((error, success) => {
  if (error) console.log("ERROR!", error);
  else console.log(success);
  return;
});