var mysql   = require('mysql');
var connectionpool = mysql.createPool({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});
global.db = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

db.checkIfExist = function(table,id,callback){
    db.query('SELECT id from '+table+' where id = "'+id+'"', function(err, rows, fields){
        if (err)
        {
            callback(false);
            return;
        }

        if(rows.length === 1)    //if no result
        {
            callback(true);
            return;
        }
        else
        {
            callback(false);
            return;
        }
    });
};

var genHash = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

global.genToken = function(req,userId,callback){
    var token = randtoken.generate(16);     //gen token
    var ip = req.headers['x-forwarded-for'] ||  //get user ip
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    var expDate = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');

    db.query('INSERT into auth_tokens set token = "'+token+'", ip_address = "'+ip+'", user_id = "'+userId+'",create_date = "'+currentDate+'",expire_date = "'+expDate+'"', function(err, rows, fields)
    {
        var ed = moment(expDate).toDate();
        var r = {
            token : token,
            expire_date : ed
        }
        callback(r);
    });
};