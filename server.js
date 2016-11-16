//  server.js
//  Endorse

//CALL PACKAGES
var express    = require("express");
var app        = express(); 
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mongoose   = require("mongoose");

//APP Configuration
// use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// Database variable outside of database connection callback to reuse connection pool in app
var db;

// Connect to the database before starting the application server.
var localDatabase = "mongodb://localhost/endorse";
var productionDatabase = process.env.MONGODB_URI;
var currentDatabase = (process.env.HOME == "/Users/aereostophanes") ? localDatabase : productionDatabase;
mongoose.connect(currentDatabase, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse
  db = database;
  console.log("Database connection ready");

  // Initialize app
  var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//ROUTES
//api routes
var apiRoutes  = require("./app/routes/api")(app, express);
app.use("/api", apiRoutes);

//basic route for home page
app.get("/", function(req, res) {
	res.send("Welcome to the homepage")
});
