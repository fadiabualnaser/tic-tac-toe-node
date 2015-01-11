var mongoose = require('mongoose');

var db_conn;



console.log("connecting to DB: " + db_path);
db_conn = mongoose.createConnection('mongodb://hussamqaza:domoha@yah00@ds059907.mongolab.com:59907/xo-node');

console.log("connected to DB");
    
module.exports = db_conn;