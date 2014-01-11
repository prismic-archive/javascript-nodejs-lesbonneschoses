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
  ctx.api.form('products').ref(ctx.ref).submit(function(products) {

    // Query the `featured` collection
    ctx.api.form('featured').ref(ctx.ref).submit(function(featured) {

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
  ctx.api.form('products').ref(ctx.ref).submit(function(products) {

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
    function(product) {

      // Retrieve the related products
      prismic.getDocuments(ctx,

        // Get all related product ids
        _.chain(product.getAll('product.related').map(function(link) {
          if(link.document.type == "product" && !link.isBroken) {
            return link.document.id;
          }
        }).filter(function(link) { return link; })).value(), 

        // Then
        function(relatedProducts) {

          res.render('productDetail', {
            product: product,
            relatedProducts: relatedProducts,
            categories: categories
          });

        }

      );
    },
    function(doc) {
      res.redirect(302, ctx.linkResolver(ctx, doc));
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
    function(selection) {

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
          function(products) {

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
      res.redirect(302, ctx.linkResolver(ctx, doc));
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
  prismic.getBookmark(ctx, 'stores', function(page) {

    ctx.api.form('stores').ref(ctx.ref).submit(function(stores) {

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
    function(store) {

      res.render('storeDetail', {
        store: store,
        menu: 'stores'
      });

    },
    function(doc) {
      res.redirect(302, ctx.linkResolver(ctx, doc));
    },
    function(NOT_FOUND) {
      res.send(404, 'Sorry, we cannot find this store!');
    }
  );

});

// -- Jobs

exports.jobs = prismic.route(function(req, res, ctx) {

  // Get the bookmarked document
  prismic.getBookmark(ctx, 'jobs', function(page) {

    ctx.api.form('jobs').ref(ctx.ref).submit(function(jobs) {

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
  prismic.getBookmark(ctx, 'jobs', function(page) {

    var id = req.params['id'],
        slug = req.params['slug'];

    // Retrieve the job document
    prismic.getDocument(ctx, id, slug, 
      function(job) {

        res.render('jobDetail', {
          page: page,
          job: job,
          menu: 'jobs'
        });

      },
      function(doc) {
        res.redirect(302, ctx.linkResolver(ctx, doc));
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
    ctx.api.form('everything').query('[[:d = any(document.type, ["product", "selection"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(products) {

      // Search others
      ctx.api.form('everything').query('[[:d = any(document.type, ["article", "blog-post", "job-offer", "store"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(others) {

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
