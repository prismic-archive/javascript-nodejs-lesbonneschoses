
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    blogRoutes = require('./routes/blog')
    http = require('http'),
    path = require('path'),
    engine = require('ejs-locals'),
    underscore = require('underscore'),
    numeral = require('numeral'),
    moment = require('moment'),
    prismic = require('./prismic-helpers');

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals({
  _: underscore,
  numeral: numeral,
  moment: moment
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('1234'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.home);
app.get('/products', routes.products);
app.get('/products/:id/:slug', routes.productDetail);
app.get('/selections/:id/:slug', routes.selectionDetail);
app.get('/about', routes.about);
app.get('/stores', routes.stores);
app.get('/stores/:id/:slug', routes.storeDetail);
app.get('/jobs', routes.jobs);
app.get('/jobs/:id/:slug', routes.jobDetail);
app.get('/search', routes.search);

app.get('/blog', blogRoutes.posts);
app.get('/blog/categories/:category', blogRoutes.posts);
app.get('/blog/posts/:id/:slug', blogRoutes.postDetail);

// OAuth - Routes
app.get('/signin', prismic.signin);
app.get('/auth_callback', prismic.authCallback);
app.post('/signout', prismic.signout);

var PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, function() {
  console.log('Express server listening on port ' + app.get('port'));
});
