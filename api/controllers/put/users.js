var updatedObj = {};

var check = function(req,callback)
{
    var r = {            //json return structure
        success : false,
        statusCode : 403,
        message : "UNDEFINED_TOKEN"
    };

    var token = req.cookies.sbstr_token;
    var post = req.body;
    var userId;

    async.series([          //exec all function async

    function(callback)
    {
        if(!token)
        {
            callback(r);
            return;
        }
        callback(null);
    },
    function(callback)
    {
        for (var i = 0; i < config.tables[req.params.table].required.length; i++)
        {
            if(!post[config.tables[req.params.table].required[i]])
            {
                r.message = "MISSING_REQUIRED_VALUE_"+config.tables[req.params.table].required[i];
                callback(r);
                return;
            }
            else
            {
                updatedObj[config.tables[req.params.table].required[i]] = validator.toString(post[config.tables[req.params.table].required[i]]);
            }
        }
        callback(null);
    },

    function(callback)
    {
        //token validation
        db.query('SELECT user_id from auth_tokens where token = "'+token+'" and expire_date > NOW()', function(err, rows, fields)
        {
            if (err)
            {
                r.message = err;
                callback(r);
                return;
            }

            if(rows.length === 0)    //if result
            {
                r.message = "INVALID_TOKEN";
                callback(r);
                return;
            }
            userId = rows[0].user_id;
            callback(null);
        });
    }

    ],
    function(ret)       //everything ok, send to the db
    {
        if(ret === null)
        {
            var qStr = "";
            var vrg = "";
            for(var param in updatedObj) {
                qStr = qStr+vrg+''+param+' = "'+updatedObj[param]+'"';
                vrg = ",";
            }

            console.log(qStr);
            
            db.query('UPDATE users set '+qStr+' WHERE id = '+userId, function(err, rows, fields)
            {
                if (err)
                {
                    r.statusCode = 500;
                    r.success = false;
                    r.message = err;
                    callback(r);
                    return;
                }
                else
                {
                    r.statusCode = 200;
                    r.success = true;
                    r.message = "OK";
                    callback(r);
                    return;
                }
                
            });
        }
        else
        {
            callback(ret);
        }
    });
};