//General dependencies.
var express = require('express');
var app = express()
var http = require('http');
var server = http.createServer(app);
var path = require('path');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var mongoose = require('mongoose');

//Set server port
server.listen(2000);
server.listen(app.get('port'), function () {
    console.log('Express server running, listening on port ' + server.address().port);
});

mongoose.connect('buckybronco:gobroncos2016@ds061371.mongolab.com:61371/test_db');

//ContextIO setup stuff for REST calls through the CIO client! Be cool, don't touch the secret.
var ContextIO = require('contextio');
var contextIOClient = new ContextIO.Client({
	key: "6o5bljnr",
	secret: "mgMC5BOA7y510IFF"
});


app.get('/emails', function(request, response){
	//Assume, at this stage: black box, authentication and everything done and in GET /storeEmails we'll be able to get the JSON with all the email messages from context.io.
	//This object will be whittled down to the email schema currently seen in the route, and the fields will be set appropriately. 
	
	var Schema = mongoose.Schema;

	var userData = new Schema({
	    emailId: String,
	    account_Id: String,
	    relevantData: [String]
	});



	var userDataModel = mongoose.model("userDataModel", userData, "user_data");
	var userData = new userDataModel();


	var emailAddress = request.query.email;
	var accountId; 

	contextIOClient.accounts().get({email:emailAddress}, function (err, response) {
		//Blocking callback to GET /accounts.
		    if (err) 
		    	throw err;
		   
    		accountId = response.body[0].id;
    		console.log(accountId);


    		var senders = ["ship-confirm@amazon.com"]; //Add more addresses here.

    			//Make call to get messages, with this accountId.
    			//send sender, subject, body to parsing module.
    			var jsonArray = [];
    			var json = {};
    			var sender;
    			var subject;
    			var body;
    			for(var i=0; i < senders.length; i++){
    				contextIOClient.accounts(accountId).messages().get({id:accountId, from:senders[i], include_body:1, body_type: "text/html"}, function (err, response) {
    					sender = response.body[0].addresses.from.email;
    					subject = response.body[0].subject;
    					body = response.body[0].body[0].content;
    					console.log("Sender:" + sender);
    					console.log("Subject:" + subject);
    					console.log("Body:" + body);
    					json = {"sender":sender, "subject":subject, "body":body};
    					jsonArray.push(json);
    				});	
    			}



    			//Pass through userData scheme to store in DB.
  			  	// userData.emailId = emailAddress;
				// userData.account_Id = accountId;
				// userData.relevantData = relevantData;
				// userData.save(function(err) {
			 	//            console.log("User Data CREATED");
			 	//            console.log(userData);
			 	//        });

		
	});

        
});

