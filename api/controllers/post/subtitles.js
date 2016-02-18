var check = function(req,callback)
{
	var r = {			//json return structure
		success : false,
		statusCode : 403,
		message : "Access denied"
	};

	var post = req.body;
	var token = req.query.token;

	async.series([			//exec all function async

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
        }
        callback(null);
    },
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
        db.checkIfExist("subtitle_sheets",post.subtitle_sheet_id,function(exist)
        {
            if(!exist)
            {
            	r.statusCode = 403,
                r.message = "INVALID_SHEET";
                callback(r);
                return;
            }
            callback(null);
        });
    },

	function(callback)
	{
		if(	!validator.isFloat(post.start_time) ||
		!validator.isFloat(post.end_time))
		{
			r.message = "INVALID_INPUT";
			callback(r);
			return;
		}
		callback(null);
	}

	],
	function(ret)		//everything ok, send to the db
	{
		if(ret)  //if error : display and stop
        {
            callback(ret);
            return;
        }

		db.query('INSERT into subtitles set subtitle_sheet_id = "'+post.subtitle_sheet_id+'", start_time = "'+post.start_time+'", end_time = "'+post.end_time+'"', function(err, result)
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
	        	r.statusCode = 201;
	        	r.success = true;
	            r.message = result.insertId;
				callback(r);
				return;
	        }

	    });
		
	});
};