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

 // //Context.io initialization:
 //  var ContextIO = require('contextio');
 //  var ctxioClient = new ContextIO.Client({
   	
 //  });



app.get('/storeEmails', function(request, response){
	//Assume, at this stage: black box, authentication and everything done and in GET /storeEmails we'll be able to get the JSON with all the email messages from context.io.
	//This object will be whittled down to the email schema currently seen in the route, and the fields will be set appropriately. 
	var Schema = mongoose.Schema;
	
	var messageSchema = new Schema({
		subject: String, 
		body: String
	});

	var email = new Schema({
	    emailId: String,
	    account_Id: String,
	    messages: [messageSchema]
	});


	var emailModel = mongoose.model("emailModel", email, "emails");
	var userEmail = new emailModel();
	
	var arrayOfMessageObjects = [{"subject":"Message 1", "body": "I am message 1"}, {"subject":"Message 2", "body": "I am message 2"}, {"subject":"Message 3", "body": "I am message 3"}];
	
	userEmail.emailId = "aditprab@gmail.com";
	userEmail.account_Id = "324091";
	userEmail.messages = arrayOfMessageObjects;

	
	userEmail.save(function(err) {
            console.log("NAME SCHEMA CREATED");
            console.log(userEmail);
        });
        
});

