var reqValues = ["nickname","password"];

var check = function(req,callback)
{
	var tempId;
	var r = {			//json return structure
		success : false,
		statusCode : 403,
		message : "Access denied"
	}

	var post = req.body;

	async.series([			//exec all function async

	function(callback)
	{
		for (var i = 0; i < reqValues.length; i++)
		{
			if(typeof post[reqValues[i]] == 'undefined')
			{
				r.message = "MISSING_REQUIRED_VALUE_"+reqValues[i];
				callback(r);
			}
		};
		callback(null);
	},

	function(callback)
	{
		var encPass = passwordHash.generate(post.password);
		db.query('SELECT id,password from users where nickname = "'+post.nickname+'"', req.params.id, function(err, rows, fields)
		{
	        if (err)
	        {
	            callback(r);
	            return;
	        }
	        if(rows.length == 0)	//if result
	        {
	            r.message = "INVALID_LOGIN";
				callback(r);
				return;
	        }

	        var cp = passwordHash.verify(post.password, rows[0].password);

	        if(!cp)
	        {
	        	r.message = "INVALID_LOGIN"; // invalid_password
				callback(r);
				return;
	        }
	        tempId = rows[0].id;

	        callback(null);
	    });
	}

	],
	function(ret)		//everything ok, send token and set cookie
	{
		if(ret === null)
		{
			genToken(req,tempId,function(token)
			{
				r.statusCode = 201;
				r.success = true;
				r.message = token;
				callback(r);
			});
		}
		else
		{
			callback(ret);
		}
		
	});
};