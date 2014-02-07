var prismic = require('../prismic-helpers'),
    _ = require('underscore');

/** For a better organization, used by several pages **/
var categories = {
  "Macaron": "Macarons",
  "Cupcake": "Cup Cakes",
  "Pie": "Little Pies"
};

// -- Home page

exports.home = prismic.route(function(req, res, ctx) {

  // Query the `products` collection
  ctx.api.form('products').ref(ctx.ref).submit(function(err, products) {
    if (err) { prismic.onPrismicError(err, req, res); return; }

    // Query the `featured` collection
    ctx.api.form('featured').ref(ctx.ref).submit(function(err, featured) {
      if (err) { prismic.onPrismicError(err, req, res); return; }

      res.render('home', {
        products: products,
        featured: featured,
        categories: categories
      });

    });

  });

});

// -- Products list

exports.products = prismic.route(function(req, res, ctx) {

  // Query the `products` collection
  ctx.api.form('products').ref(ctx.ref).submit(function(err, products) {
    if (err) { prismic.onPrismicError(err, req, res); return; }

    res.render('products', {
      products: products,
      categories: categories
    });

  });

});

// -- Product detail

exports.productDetail = prismic.route(function(req, res, ctx) {

  var id = req.params['id'],
      slug = req.params['slug'];

  // Retrieve the product document
  prismic.getDocument(ctx, id, slug, 
    function(err, product) {
      if (err) { prismic.onPrismicError(err, req, res); return; }

      // Retrieve the related products
      prismic.getDocuments(ctx,

        // Get all related product ids
        _.chain(product.getAll('product.related').map(function(link) {
          if(link.document.type == "product" && !link.isBroken) {
            return link.document.id;
          }
        }).filter(function(link) { return link; })).value(), 

        // Then
        function(err, relatedProducts) {
          if (err) { prismic.onPrismicError(err, req, res); return; }

          res.render('productDetail', {
            product: product,
            relatedProducts: relatedProducts,
            categories: categories
          });

        }

      );
    },
    function(doc) {
      res.redirect(301, ctx.linkResolver(ctx, doc));
    },
    function(NOT_FOUND) {
      res.send(404, 'Sorry, we cannot find this product!');
    }
  );

});

// -- Selection detail

exports.selectionDetail = prismic.route(function(req, res, ctx) {

  var id = req.params['id'],
      slug = req.params['slug'];

  // Retrieve the selection document
  prismic.getDocument(ctx, id, slug, 
    function(err, selection) {

      if (err) { prismic.onPrismicError(err, req, res); return; }

      if(selection) {

        // Retrieve the related products
        prismic.getDocuments(ctx,

          // Get all related product ids
          _.chain(selection.getAll('selection.product').map(function(link) {
            if(link.document.type == "product" && !link.isBroken) {
              return link.document.id;
            }
          }).filter(function(link) { return link; })).value(), 

          // Then
          function(err, products) {

            if (err) { prismic.onPrismicError(err, req, res); return; }

            res.render('selectionDetail', {
              selection: selection,
              products: products,
              categories: categories
            });

          }

        );
      }

    },
    function(doc) {
      res.redirect(301, ctx.linkResolver(ctx, doc));
    },
    function(NOT_FOUND) {
      res.send(404, 'Sorry, we cannot find this selection!');
    }
  );

});

// -- About

exports.about = prismic.route(function(req, res, ctx) {

  // Get the bookmarked document
  prismic.getBookmark(ctx, 'about', function(page) {

    res.render('about', {
      page: page,
      menu: 'about'
    });

  });

});

// -- Stores

exports.stores = prismic.route(function(req, res, ctx) {

  // Get the bookmarked document
  prismic.getBookmark(ctx, 'stores', function(err, page) {

    if (err) { prismic.onPrismicError(err, req, res); return; }

    ctx.api.form('stores').ref(ctx.ref).submit(function(err, stores) {

      if (err) { prismic.onPrismicError(err, req, res); return; }

      res.render('stores', {
        page: page,
        stores: stores,
        menu: 'stores'
      });

    });

  });

});

// -- Store detail

exports.storeDetail = prismic.route(function(req, res, ctx) {

  var id = req.params['id'],
      slug = req.params['slug'];

  // Retrieve the store document
  prismic.getDocument(ctx, id, slug, 
    function(err, store) {

      if (err) { prismic.onPrismicError(err, req, res); return; }

      res.render('storeDetail', {
        store: store,
        menu: 'stores'
      });

    },
    function(doc) {
      res.redirect(301, ctx.linkResolver(ctx, doc));
    },
    function(NOT_FOUND) {
      res.send(404, 'Sorry, we cannot find this store!');
    }
  );

});

// -- Jobs

exports.jobs = prismic.route(function(req, res, ctx) {

  // Get the bookmarked document
  prismic.getBookmark(ctx, 'jobs', function(err, page) {

    if (err) { prismic.onPrismicError(err, req, res); return; }

    ctx.api.form('jobs').ref(ctx.ref).submit(function(err, jobs) {

      if (err) { prismic.onPrismicError(err, req, res); return; }

      res.render('jobs', {
        page: page,
        jobs: jobs,
        menu: 'jobs'
      });

    });

  });

});

// -- Job detail

exports.jobDetail = prismic.route(function(req, res, ctx) {

  // Get the bookmarked document
  prismic.getBookmark(ctx, 'jobs', function(err, page) {

    if (err) { prismic.onPrismicError(err, req, res); return; }

    var id = req.params['id'],
        slug = req.params['slug'];

    // Retrieve the job document
    prismic.getDocument(ctx, id, slug, 
      function(err, job) {

        if (err) { prismic.onPrismicError(err, req, res); return; }

        res.render('jobDetail', {
          page: page,
          job: job,
          menu: 'jobs'
        });

      },
      function(doc) {
        res.redirect(301, ctx.linkResolver(ctx, doc));
      },
      function(NOT_FOUND) {
        res.send(404, 'Sorry, we cannot find this store!');
      }
    );

  });

});

// -- Search

exports.search = prismic.route(function(req, res, ctx) {

  var query = req.query['query'];

  if(query) {

    // Search products
    ctx.api.form('everything').query('[[:d = any(document.type, ["product", "selection"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(err, products) {

      if (err) { prismic.onPrismicError(err, req, res); return; }

      // Search others
      ctx.api.form('everything').query('[[:d = any(document.type, ["article", "blog-post", "job-offer", "store"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(err, others) {

        if (err) { prismic.onPrismicError(err, req, res); return; }

        res.render('search', {
          query: query,
          products: products,
          others: others
        });

      });

    });

  } else {

    res.render('search', {
      query: ''
    });

  }

});
