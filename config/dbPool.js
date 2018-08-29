const mysql = require('promise-mysql');

const dbConfig = {
  host : "weatherook.c0l7ddni7jh4.ap-northeast-2.rds.amazonaws.com",
  port : 3306,
  user : 'weatherook',
  password : 'weatherook',
  database : 'weatherook',
  connectionLimit : 20
}

module.exports = mysql.createPool(dbConfig);
