exports.Configuration = {

  apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  linkResolver: function(ctx) {
    return function(doc) {
      if (doc.isBroken) return false;

      if(doc.id == ctx.api.bookmarks['about']) {
        return '/about';
      }

      if(doc.id == ctx.api.bookmarks['jobs']) {
        return '/jobs';
      }

      if(doc.id == ctx.api.bookmarks['stores']) {
        return '/stores';
      }

      if(doc.type == 'store' && !doc.isBroken) {
        return '/stores/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'product' && !doc.isBroken) {
        return '/products/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'job-offer' && !doc.isBroken) {
        return '/jobs/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'blog-post' && !doc.isBroken) {
        return '/blog/posts/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'selection' && !doc.isBroken) {
        return '/selections/' + doc.id + '/' + doc.slug;
      }
    }
  },

  onPrismicError: function(err, req, res) {
    res.send(500, "Error 500: " + err.message);
  }

};
