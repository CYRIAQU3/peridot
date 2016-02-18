var updatedSubtitle = {};
var updatedTranslation = {};
var subtitleId = parseInt(req.params.param);
var newTranslation = true;
var translationId;

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
                updatedSubtitle[config.tables[req.params.table].required[i]] = validator.toString(post[config.tables[req.params.table].required[i]]);
            }
        }
        callback(null);
    },

    function(callback)
    {
        req.params.table = "subtitle_translations";
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
                updatedTranslation[config.tables[req.params.table].required[i]] = validator.toString(post[config.tables[req.params.table].required[i]]);
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
    },
    function(callback)
    {
        db.query('SELECT id from subtitle_translations where subtitle_id = "'+subtitleId+'" and language_id = "'+post.language_id+'" limit 1', function(err, rows, fields)
        {
            if (err)
            {
                r.message = err;
                callback(r);
                return;
            }

            if(rows.length !== 0)    //if result
            {
                translationId = rows[0].id;
                newTranslation = false;
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

        var str = "";   //build the subtitle query
        var vrg = "";
        for(var param in updatedSubtitle) {
            str = str+vrg+''+param+' = "'+updatedSubtitle[param]+'"';
            vrg = ",";
        }

        var ttr = "";   //build the translation query
        var vrg = "";
        for(var param in updatedTranslation) {
            ttr = ttr+vrg+''+param+' = "'+updatedTranslation[param]+'"';
            vrg = ",";
        }

        async.series([
        function(callback)      //update subtitle
        {
            db.query('UPDATE subtitles set '+str+' WHERE id = '+subtitleId, function(err, rows, fields)
            {
                console.log('UPDATE subtitles set '+str+' WHERE id = '+subtitleId);
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
            var q = 'UPDATE subtitle_translations set '+ttr+' where id = "'+translationId+'"';
            if(newTranslation)
            {
                q = 'INSERT into subtitle_translations set '+ttr+', subtitle_id = "'+subtitleId+'"';
            }
            console.log(q);

            db.query(q,function(err,rows,fields)
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
                r.statusCode = 200;
                r.success = true;
                r.message = "OK";
                callback(r);
                return;
            }
        });
    });
};