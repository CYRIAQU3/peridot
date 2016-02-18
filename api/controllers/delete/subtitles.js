var subtitleId = parseInt(req.params.param);
var translationIds = [];
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
        db.checkIfExist("subtitles",subtitleId,function(exist)
        {
            if(!exist)
            {
                r.message = "NOT_EXIST";
                callback(r);
                return;
            }
            callback(null);
        });
    }

    ],
    function(ret)      
    {
        if(ret)  //if error : display and stop
        {
            callback(ret);
            return;
        }

        async.series([
        function(callback)      //update subtitle
        {
            db.query('DELETE from subtitle_translations where subtitle_id = "'+subtitleId+'"', function(err, rows, fields)
            {
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
        },

        function(callback)      //update translation
        {
            db.query('DELETE from subtitles where id = "'+subtitleId+'"',function(err,rows,fields)
            {
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
                r.statusCode = 204;
                r.success = true;
                r.message = "OK";
                callback(r);
                return;
            }
        });
    });
};