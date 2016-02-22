var updated = {};
var targetId = parseInt(req.params.param);

var check = function(req,callback)
{
    var r = {            //json return structure
        success : false,
        statusCode : 403,
        message : "UNDEFINED_TOKEN"
    };

    var token = req.query.token;
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
                updated[config.tables[req.params.table].required[i]] = validator.toString(post[config.tables[req.params.table].required[i]]);
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
    },
    function(callback)                  //check if the target exist
    {
        db.checkIfExist("files",targetId,function(exist)
        {
            if(!exist)
            {
                r.message = "NOT_EXIST";
                callback(r);
                return;
            }
            callback(null);
        });
    }],
    function(ret)      
    {
        if(ret)  //if error : display and stop
        {
            callback(ret);
            return;
        }

        var str = "";   //build the file query
        var vrg = "";
        for(var param in updated) {
            str = str+vrg+''+param+' = "'+updated[param]+'"';
            vrg = ",";
        }

        async.series([
        function(callback)      //update file
        {
            db.query('UPDATE files set '+str+' WHERE id = '+targetId, function(err, rows, fields)
            {
                console.log('UPDATE files set '+str+' WHERE id = '+targetId);
                if (err)
                {
                    r.statusCode = 500;
                    r.success = false;
                    r.message = err;
                    callback(r);
                    return;
                }
                callback(null);
                
            });
        }],
        function(upt)
        {
            if(upt)
            {
                callback(upt);
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
    });
};