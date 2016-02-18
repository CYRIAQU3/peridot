var check = function(req,callback)
{
	var r = {			//json return structure
		success : false,
		statusCode : 403,
		message : "Access denied"
	}

	var post = req.body;

	var required = ["nickname","email","password"];

	async.series([			//exec all function async

	function(callback)
    {
        for (var i = 0; i < required.length; i++)
        {
            if(!post[required[i]])
            {
                r.message = "MISSING_REQUIRED_VALUE_"+required[i];
                callback(r);
                return;
            }
        }
        callback(null);
    },

	function(callback)
	{
		if(	!validator.isEmail(post.email) ||
		!validator.isLength(post.nickname,{min:4,max:25}) ||
		!validator.isLength(post.password,{min:6,max:30}))
		{
			r.message = "INVALID_INPUT";
			callback(r);
			return;
		}
		callback(null);
	},

	function(callback)
	{
		db.query('SELECT id from users where email = "'+post.email+'"', req.params.id, function(err, rows, fields)
		{
	        if (err)
	        {
	            callback(r);
	            return;
	        }
	        if(rows.length !== 0)	//if result
	        {
	            r.message = "EMAIL_ALREADY_USED";
				callback(r);
				return;
	        }
	        callback(null);
	    });
	},

	function(callback)
	{
		db.query('SELECT id from users where nickname = "'+post.nickname+'"', req.params.id, function(err, rows, fields)
		{
	        if (err)
	        {
	            callback(r);
	            return;
	        }
	        if(rows.length !== 0)	//if result
	        {
	            r.message = "NICKNAME_ALREADY_USED";
				callback(r);
				return;
	        }
	        callback(null);
	    });
	}

	],
	function(ret)		//everything ok, send to the db
	{
		if(ret)  //if error : display and stop
        {
            callback(ret);
            return;
        }
		var encPass = passwordHash.generate(post.password);
		db.query('INSERT into users set nickname = "'+post.nickname+'", email = "'+post.email+'", password = "'+encPass+'"', function(err, rows, fields)
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
	            r.message = "OK";
	            callback(r);
				return;
	        }
	    });
	});
};