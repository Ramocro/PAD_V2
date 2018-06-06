var config = require('./config.js');
var MySQL = require('./modules/mysql.js');

console.log("====================================================================\n\
 __ __   ___   __ __  ____    ____  ____     ___   ____  ___   _____\n\
|  |  | /   \\ |  |  ||    \\  /    ||    \\   /  _] /    ||   \\ / ___/\n\
|  |  ||     ||  |  ||  _  ||   __||  D  ) /  [_ |  o  ||    (   \\_ \n\
|  ~  ||  O  ||  |  ||  |  ||  |  ||    / |    _]|     ||  D  \\__  |\n\
|___, ||     ||  :  ||  |  ||  |_ ||    \\ |   [_ |  _  ||     /  \\ |\n\
|     ||     ||     ||  |  ||     ||  .  \\|     ||  |  ||     \\    |\n\
|____/  \\___/  \\__,_||__|__||___,_||__|\\_||_____||__|__||_____|\\___|\n\n\
====================================================================\n\
");

var mysql = new MySQL(config.mysql);

mysql.connect(
	function(err){
		if (err) throw err;
		console.log('connected as id ' + mysql.connection.threadId);
		const router = require('./modules/router.js');
		router.mysql = mysql;
	}
);