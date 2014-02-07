var prismic = require('../prismic-helpers'),
    _ = require('underscore');

// -- Categories

var categories = [
  "Announcements", 
  "Do it yourself", 
  "Behind the scenes"
];

// -- Index

exports.posts = prismic.route(function(req, res, ctx) {

  var category = req.params['category'];

  ctx.api.form('blog').ref(ctx.ref).query(category ? '[[:d = at(my.blog-post.category, "' + category + '")]]' : '').submit(function(err, posts) {

    if (err) { prismic.onPrismicError(err, req, res); return; }

    res.render('posts', {
      posts: posts,
      categories: categories
    });

  });

});

// -- Post detail

exports.postDetail = prismic.route(function(req, res, ctx) {

  var id = req.params['id'],
      slug = req.params['slug'];

  prismic.getDocument(ctx, id, slug, function(err, post) {

    if (err) { prismic.onPrismicError(err, req, res); return; }

    // Retrieve the related products
    prismic.getDocuments(ctx,

      // Get all related product ids
      _.chain(post.getAll('blog-post.relatedproduct').map(function(link) {
        if(link.document.type == "product" && !link.isBroken) {
          return link.document.id;
        }
      }).filter(function(link) { return link; })).value(), 

      // Then
      function(err, relatedProducts) {

        if (err) { prismic.onPrismicError(err, req, res); return; }

        // Retrieve the related posts
        prismic.getDocuments(ctx,

          // Get all related product ids
          _.chain(post.getAll('blog-post.relatedpost').map(function(link) {
            if(link.document.type == "blog-post" && !link.isBroken) {
              return link.document.id;
            }
          }).filter(function(link) { return link; })).value(), 

          // Then
          function(err, relatedPosts) {

            if (err) { prismic.onPrismicError(err, req, res); return; }

            res.render('postDetail', {
              post: post,
              relatedProducts: relatedProducts,
              relatedPosts: relatedPosts,
              categories: categories
            });           

          }

        );

      }

    );

  },
  function(doc) {
    res.redirect(302, ctx.linkResolver(ctx, doc));
  },
  function(NOT_FOUND) {
    res.send(404, 'Sorry, we cannot find this blog post!');
  });

});