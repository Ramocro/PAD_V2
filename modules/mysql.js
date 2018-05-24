var mysql = require('mysql');

function MySQL(mySQLConf) {
	this.connection = mysql.createConnection({
		host: mySQLConf.host,
		port: mySQLConf.port,
		user: mySQLConf.username,
		password: mySQLConf.password,
		database: mySQLConf.database
	});
}

MySQL.prototype.connect = function(call) {
	this.connection.connect(call);
}

MySQL.prototype.query = function(query, call) {
	this.connection.query(query, call);
}

MySQL.prototype.close = function(call) {
	this.connection.end(call);
}

module.exports = MySQL;