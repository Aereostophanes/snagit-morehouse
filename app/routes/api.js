// api.js
// SnagIt
// URL FOR HEROKU SERVER: https://snagit-morehouse.herokuapp.com/

var User = require('../models/user');
var Book = require('../models/book');
var Transaction = require('../models/transaction');

module.exports = function(app, express) {
	
	var apiRouter = express.Router();
	
	//middleware to use for all requests
	apiRouter.use(function(req, res, next) {
		//authenticate users here
		next();
	});
	
	//root response for api
	//accessed at http://endorse-backend-api.herokuapp.com/api/
	apiRouter.get("/", function(req, res) {
		res.json({ message: "Welcome to List API!" });
	});
	
	apiRouter.route("/users")
	
		// create users
		.post(function(req, res) {
			//new instance of User model
			var user = new User();
			
			//set users information (which comes from request)
			user.firstName = req.body.firstName;
			user.lastName  = req.body.lastName;
			user.username  = req.body.username;
			user.email     = req.body.email;
			user.password  = req.body.password;
			
			user.save(function(err) {
			
				if (err) {
					return res.send(err);
				}
				
				res.json({ errmsg: "Nil", message: "User created!", user_id: user.id, username: user.username });
			
			});
		})
	
		.get(function(req, res) {
			//attempt to find all users
			User.find(function(err, users) {
				//if error, return error
				if (err)
					res.send(err);
				
				//return all users
				res.json(users);
			});
		});
	
	// authenticate user for login
	// returns json containing user id
	apiRouter.post("/authenticate_user", function(req, res) {
		
		// find the user
		// select the name email and password explicitly
		User.findOne({
			email: req.body.email
		}).select('email password username').exec(function(err, user) {

			if (err) throw err;

			// no user with that email was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				} else
					res.json(user);
			}

		});
		
	});
	
	// on routes that end in /users/:user_id
	apiRouter.route('/users/:user_id')

		// get the user with this id
		// (accessed at GET https://endorse-backend-api.herokuapp.com/api/users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) 
					res.send(err);

				// return that user
				res.json(user);
			});
		})
	
		.put(function(req, res) {
		
			// use user model to find user
			User.findById(req.params.user_id, function(err, user) {
		
				if (err) 
					res.send(err);

				// update the users info only if its new
				if (req.body.firstName) 
					user.firstName = req.body.firstName;
				if (req.body.lastName) 
					user.lastName = req.body.lastName;
				if (req.body.email) 
					user.email = req.body.email;
				if (req.body.username) 
					user.username = req.body.username;
				if (req.body.password) 
					user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err)
						res.send(err);
					else
						res.json({ message: 'User updated!' });	
				});

			});
		})
	
		// delete the user with this id
		// (accessed at DELETE https://endorse-backend-api.herokuapp.com/api/users/:user_id)
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) 
					return res.send(err);
				else
					res.json({ message: 'Successfully deleted' });
			});
		});
	
	
	/*
	 Comments for other devs. The following need to be done:
	 */
	
	// new api route for books, see line 24.
	apiRouter.route("/books")
		// new get actions for new books
		.get(function(req, res) {
			//attempt to find all books
			Book.find(function(err, books) {
				//if error, return error
				if (err)
					res.send(err);
				
				//return all books
				res.json(books);
			});
		})
	
		// new post action for new books, see line 27.
		.post(function(req, res) {
			var book = new Book();
			
			//set book information (which comes from request)
			book.title          = req.body.title;
			book.author         = req.body.author;
			book.user_id        = req.body.user_id;
			book.for_sale       = true;
			book.selling_price  = req.body.selling_price;
			book.course         = req.body.course;
			book.condition      = req.body.condition;
			
			book.save(function(err) {
				if (err) {
					return res.send(err);
				}
				
				res.json({ errmsg: "Nil", message: "Book added!", book_id: book.id, title: book.title });
			});
		});
	
	 apiRouter.route("/transactions")
	 	.get(function(req, res) {
	 		Transaction.find(function(err, transactions) {
	 			if (err)
	 				res.send(err);
	 			res.json(transactions);
	 		});
	 	})
	 	.post(function(req, res) {
	 		var transaction = new Transaction();

	 		//set transaction information (which comes from request)
	 		transaction.buy_user_id = req.body.buy_user_id;
	 		transaction.sell_user_id = req.body.sell_user_id;
	 		transaction.book_id = req.body.book_id;

	 		transaction.save(function(err) {
	 			if (err)
	 				return res.send(err);
	 			res.json({ errmsg : "Nil", message : "Transaction created!", buy_user_id : transaction.buy_user_id, sell_user_id : transaction.sell_user_id, book_id : transaction.book_id})
	 		});
	 	});
	 	
	apiRouter.get("/books/find", function(req, res) {
		
		// errors in request parameters
		if ( !(req.param('searchKey')) || !(req.param('searchValue')) ) {
			res.json({
				success: false,
				message: 'Invalid request parameters'
			});	
		}
		
		// attempt to find books
		Book.find({
			[req.param('searchKey')]: new RegExp(req.param('searchValue'), 'i')
		}).select('title author selling_price course condition').exec(function(err, books) {
			if (err) throw err;
			
			// no books with those specifications were found
			if (!books) {
				res.json({
					success: false,
					message: 'No books found.'
				});
			} else if (books) {
				res.json(books);
			}

		});
		
	});	
	return apiRouter;
}
