

const { MailQueued } = require('../models');
const HandledHtmlError = require('../exceptions/HandledHtmlError');
const LogService = require('../services/logService');

/*
* 	Must access by POST method
*	Execute a query in the collection MailQueued
*	filter is Object
* 	limit is an Integer
* 	test: curl -d '{"filter":{}, "limit":"20"}' -H "Content-Type: application/json" -X POST http://localhost:PORT/mailQueued
*/

exports.viewListMailQueued = function(req, res) {

	const lang = req.body.language;

	try{

		let filter = req.body.filter || {};

		let limit = req.body.limit * 1 || 100;

		let q = MailQueued.find(filter).limit(limit);

		q.exec(function(err, data) {
		    if (err) {
		    	
				let	err = new HandledHtmlError('SomethingFailed', lang, err);
				LogService.error(err.message, err.errorCode, req, err);
				res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });

		    }else{

		    	if(data){
		    		LogService.debug("Found :"+data.length+" rows");
		    		res.json({ resultSet: data, message: 'ok' });	
		    	}else{
		    		res.json({ resultSet:[], message: 'No data' });
		    	}
		    	
		    }
	  	});

  	}catch(err){
  		if(!(err instanceof HandledHtmlError)){
			err = new HandledHtmlError('SomethingFailed', lang, err);
		}
		LogService.error(err.message, err.errorCode, req, err);
		res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
	}

};

/*
*  Search one MailQueued by id
*  test: curl -X GET http://localhost:PORT/mailQueued/ID
*/
exports.viewOneMailQueued = function(req, res) {

	const lang = req.body.language;

	try{

		let id = req.params.id;

		if(!id){
			throw new HandledHtmlError("IdRequired", lang);
		}

		MailQueued.findOne({ _id:id },function(err, data) {
		    if (err) {

		    	let	err = new HandledHtmlError('SomethingFailed', lang, err);
				LogService.error(err.message, err.errorCode, req, err);
				res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });

		    }else{

		    	if(data){
			    	res.json({ resultSet: data, message: 'ok' });
		    	}else{
		    		res.json({ message: 'No data' });
		    	}
		    }
	  	})

  	}catch(err){
		if(!(err instanceof HandledHtmlError)){
			err = new HandledHtmlError('SomethingFailed', lang, err);
		}
		LogService.error(err.message, err.errorCode, req, err);
		res.status(err.htmlCode).send({ message: err.message, errorCode: err.errorCode });
	}
};



