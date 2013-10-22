## Les Bonnes Choses, JavaScript with NodeJS

This is a example project made by the prismic.io team as a showcase to help developers get started. It consumes the content repository available at [https://lesbonneschoses.prismic.io/api](https://lesbonneschoses.prismic.io/api).

You can also visit the public version hosted at [http://lesbonneschoses.prismic.me](http://lesbonneschoses.prismic.me).

### Connect it to your own repository

By the default, this application will consume the content from the original "Les Bonnes Choses" repository. You can also create your own fork of this content repository and use it instead.

Once you have created your own "Les Bonnes Choses" repository from the prismic.io Dashboard, change the `apiEndpoint` in the `prismic-configuration.js` file:

```
  apiEndpoint: 'https://lesbonneschoses-xxxxxx.prismic.io/api',
```

You can also go to the _Applications_ panel in your repository settings, and create an OAuth application to allow interactive sign-in. Just create a new application, fill the application name and the callback URL (`localhost` URLs are always authorized, so at development time you can omit to fill the Callback URL field), and copy/paste the `clientId` & `clientSecret` configuration to the `prismic-configuration.js` file:

```
  // OAuth
  clientId: 'xxxxxx',
  clientSecret: 'xxxxxx',
```

### Deploy your NodeJS application

An easy way to deploy your NodeJS application is to use [Heroku](http://www.heroku.com). Just follow these few simple steps once you have successfully signed up and installed to Heroku toolchain:

Create a `Procfile` file at your application root, to declare the server command:

```
web: node app.js
```

Create a new Heroku application

```
$ heroku create
```

Push your code to heroku:

```
$ git push heroku master
```

Ensure you have at least one node running:

```
$ heroku ps:scale web=1
```

You can now browse your application online:

```
$ heroku open
```

### Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Zengularity (http://www.zengularity.com).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
