app.get('/:table([a-z_]{1,40})', function(req,res)
{
    var f = req.params.table;
    var limit = "LIMIT "+parseInt(req.query.limit);
    if(!req.query.limit)
    {
        limit = "LIMIT 20";
    }
    if(req.query.limit == "no")
    {
        limit = "";
    }
    var cookies = req.cookies;
    if(fs.existsSync(appRoot+'/controllers/get/'+f+'.js')) //if a specific controller exist, exec it else, normal query
    {
        include(appRoot+'/controllers/get/'+f+'.js');
        check(req,function(r)
        {
            res.statusCode = 200;
            if(r.statusCode)
            {
                res.statusCode = r.statusCode;
            }
            res.send(r);
        });
        return;
    }
    else
    {
        var rList = "";
        if(typeof config.tables[req.params.table] != "undefined")
        {
            rList = config.tables[req.params.table].rows.toString();
            rTable = config.tables[req.params.table].table;
        }
        else
        {
            rList = "nothing";
            rTable = "nothing";
        }
        
        db.query('SELECT '+rList+' FROM '+rTable+' ORDER BY id DESC '+limit, req.params.id, function(err, rows, fields) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send({
                    success: false,
                    message:    err.code
                });
                return;
            }
            if(rows !== undefined)  //if result
            {
                res.statusCode = 200;
                res.send({
                    statusCode : 200,
                    success: true,
                    message:    '',
                    [req.params.table]: rows,
                    length: rows.length
                });
                return;
            }
        });
    }
});

app.get('/:table([a-z_]{1,40})/:id([0-9]{1,11})', function(req,res){
    var rList = "";
    var limit = "LIMIT "+parseInt(req.query.limit);
    if(!req.query.limit)
    {
        limit = "LIMIT 20";
    }
    if(req.query.limit == "no")
    {
        limit = "";
    }
    if(config.tables[req.params.table])
    {
        rList = config.tables[req.params.table].rows.toString();
        rTable = config.tables[req.params.table].table;
    }
    else
    {
        rList = "nothing";
        rTable = "nothing";
        res.statusCode = 304;
        res.send({
            statusCode : 304,
            success: false,
            message:    req.params.table+" not exist"
        });
        return;
    }
    db.query('SELECT '+rList+' FROM '+rTable+' WHERE id = '+req.params.id+' ORDER BY id DESC '+limit, req.params.id, function(err, rows, fields) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                statusCode : 500,
                success: false,
                message:    err.code
            });
            return;
        }
        if(rows != undefined)   //if result
        {
            res.send({
                statusCode : 200,
                success: true,
                message:    '',
                [req.params.table]: rows,
                length: rows.length
            });
            return;
        }
    });
});

//ex : /channels/1/channel_files
app.get('/:table([a-z_]{1,40})/:id([0-9]{1,11})/:row([a-z_]{1,40})', function(req,res){
    var rList = "";
    var limit = "LIMIT "+parseInt(req.query.limit);
    var rowName = req.params.row;
    if(!req.query.limit)
    {
        limit = "LIMIT 20";
    }
    if(req.query.limit == "no")
    {
        limit = "";
    }
    
    if(config.tables[rowName])
    {
        var t = [];
        for (var i = 0; i < config.tables[rowName].rows.length; i++) 
        {
            t.push(""+req.params.row+"."+config.tables[rowName].rows[i]);
        }
        rList = t.toString();
        rTable = config.tables[rowName].table;
        singleTableName = req.params.table.substring(0, req.params.table.length - 1)+"_id";
    }
    else
    {
        rList = "nothing";
        rTable = "nothing";
        singleTableName = 'nothing';
        res.statusCode = 304;
        res.send({
            statusCode : 304,
            success: false,
            message:    req.params.table+" not exist"
        });
        return;
    }


    db.query('SELECT '+rList+' FROM '+rTable+' INNER JOIN '+req.params.table+' ON '+rTable+'.'+singleTableName+' = '+req.params.table+'.id WHERE '+req.params.table+'.id = '+req.params.id+' ORDER BY '+rTable+'.id DESC '+limit, req.params.id, function(err, rows, fields) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                statusCode : 500,
                success: false,
                message:    err.code
            });
            return;
        }
        res.send({
            success: true,
            message:    '',
            [req.params.row]: rows,
            length: rows.length
        });
    });
});

app.post('/:table([a-z_]{1,20})', function(req,res){
    var f = req.params.table;
    if(fs.existsSync(appRoot+'/controllers/post/'+f+'.js')) //if a specific controller exist, exec it else, normal query
    {
        eval(fs.readFileSync(appRoot+'/controllers/post/'+f+'.js')+'');
        check(req,function(r)
        {
            res.statusCode = r.statusCode;
            res.send(r);
        });
        return;
    }
    else
    {
        res.statusCode = 403;
        res.send({
            statusCode : 403,
            success: false,
            message:    req.params.table+" is not a valid call"
        });
        return;
    }
});
app.put('/:table([a-z_]{1,20})/:param', function(req,res){
    var f = req.params.table;
    if(fs.existsSync(appRoot+'/controllers/put/'+f+'.js')) //if a specific controller exist, exec it else, normal query
    {
        eval(fs.readFileSync(appRoot+'/controllers/put/'+f+'.js')+'');
        check(req,function(r)
        {
            res.statusCode = r.statusCode;
            res.send(r);
        });
        return;
    }
    else
    {
        res.statusCode = 403;
        res.send({
            statusCode : 403,
            success: false,
            message:    req.params.table+" is not a valid call"
        });
        return;
    }
});
app.delete('/:table([a-z_]{1,20})/:param', function(req,res){
    var f = req.params.table;
    if(fs.existsSync(appRoot+'/controllers/delete/'+f+'.js')) //if a specific controller exist, exec it else, normal query
    {
        eval(fs.readFileSync(appRoot+'/controllers/delete/'+f+'.js')+'');
        check(req,function(r)
        {
            res.statusCode = r.statusCode;
            res.send(r);
        });
        return;
    }
    else
    {
        res.statusCode = 403;
        res.send({
            statusCode : 403,
            success: false,
            message:    req.params.table+" is not a valid call"
        });
        return;
    }
});