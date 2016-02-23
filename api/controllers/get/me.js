global.check = function(req,callback)
{
    var r = {            //json return structure
        success : false,
        statusCode : 403,
        message : "MISSING_TOKEN_NOT_LOGGED"
    };

    if(req.query.token === undefined || req.query.token === "")
    {
        callback(r);
        return;
    }

    var token = req.query.token;
    //token validation
    db.query('SELECT user_id from auth_tokens where token = "'+token+'" and expire_date > NOW()', function(err, rows, fields)
    {
        if (err)
        {
            r.message = err;
            callback(r);
            return;
        }

        if(rows.length == 0)    //if result
        {
            r.message = "INVALID_TOKEN";
            callback(r);
            return;
        }

        var userId = rows[0].user_id;

        var rList = config.tables["me"].rows.toString();
        var rTable = config.tables["me"].table;
        
        db.query('SELECT '+rList+' FROM '+rTable+' WHERE id = '+userId+' ORDER BY id DESC LIMIT 1', function(err, rows, fields) {
            if (err) {
                console.error(err);
                r.success = false;
                r.message = err.code;
                callback(r);
            }
                
            if(rows !== undefined)   //if result
            {
                r = {
                    success: true,
                    statusCode : 200,
                    message:    '',
                    me: rows,
                    length: rows.length
                };
                callback(r);
            }
        });
    });
};