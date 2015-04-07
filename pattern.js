/* This module implements a pattern matching system contingent on an email's sender. If email is sent by a sender with a known pattern, we can apply the pattern and collect relevant information from the email. */

/* json_object expected to be of form 
 * {
 *	sender:String,
 * 	subject:String,
 *	message:String
 * }
 */
var cheerio = require('cheerio');

/* template for emails sent by amazon confirming shipment */
var amazon = function(html){
	var $ = cheerio.load(html);
	var items = [];
	var totals = [];
	$('table > tbody > tr + tr + tr + tr + tr + tr > td > table > tbody > tr > td + td > p > a').each(function(){
		items.push($(this).text());
	});
	$('table > tbody > tr + tr + tr + tr + tr + tr > td > table > tbody > tr > td + td + td > strong').each(function(){
		totals.push($(this).text());
	});
	if(items.length < 2)
	{
		items = items[0];
		totals = totals[0];
	}
	return { 'purchased':items, 'subtotal':totals }
}

var uber = function(html){
	var $ = cheerio.load(html);
	var starting = $('tbody > tr > td > table > tbody > tr + tr > td > table > tbody > tr > td + td > span + span').text();
	var end = $('tbody > tr > td > table > tbody > tr + tr > td > table > tbody > tr + tr > td > span + span').text();
	var subtotal = $('tbody > tr > td + td > span > table + table > tbody > tr + tr + tr + tr').text();
	return { 'start':starting, 'end':ending, 'subtotal':subtotal };
}

/* regex and senders share one-to-one correspondance. Whichever regex matches the sender for which the function is being called corresponds to the pattern that should be applied to get data from it. */
var senders = [amazon, uber],
	regex = [/[A-Za-z]+-confirm@amazon.com$/, /^receipts.[A-Za-z]+@uber.com$/];

var apply = function(json_array){
	var json_object;

	/* for each message in constituting json_array, try to find a pattern that matches the html format. */
	for(var k = 0; k < json_array.length; k++)
	{
		json_object = json_array[k];
		for(var i = 0; i < senders.length; i++)
		{
			if(json_object.sender.match(regex[i]))
			{
				var template = senders[i];
				return template(json_object.body);
			}
		}
		return {'error':'unable to find the template associated with the sender'};
	}
}

module.exports.apply = apply;