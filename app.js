//creating an empty app variable:
var app;

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , nunjucks = require('nunjucks')
  , septa = require('node-septa')();

//defining app
app = express();

//setting up nunjucks
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');

  //feed app to nunjucks environment
  env.express(app);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);

app.get('/bus/:bus', function(req, res){
  //call septa's getBus method (returns JSON) and output the response in our browser
  septa.getBus(req.params.bus, function(data){
    res.send(data);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
