exports.Configuration = {

  apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  linkResolver: function(ctx, doc) {
    if (doc.isBroken) return false;

    if(doc.id == ctx.api.bookmarks['about']) {
      return '/about' + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');
    }

    if(doc.id == ctx.api.bookmarks['jobs']) {
      return '/jobs' + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');
    }

    if(doc.id == ctx.api.bookmarks['stores']) {
      return '/stores' + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');
    }

    if(doc.type == 'store' && !isBroken) {
      return '/stores/' + doc.id + '/' + doc.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');;
    }

    if(doc.type == 'product' && !isBroken) {
      return '/products/' + doc.id + '/' + doc.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');;
    }

    if(doc.type == 'job-offer' && !isBroken) {
      return '/jobs/' + doc.id + '/' + doc.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');;
    }

    if(doc.type == 'blog-post' && !isBroken) {
      return '/blog/posts/' + doc.id + '/' + doc.slug + (ctx.maybeRef ? '?ref=' + ctx.maybeRef : '');;
    }

  }

};