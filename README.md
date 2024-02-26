# Features Netlify module

## Description
Dynamically generate `_headers` and `_redirects` files for Netlify in your Nuxt.js projects.

This module supports the creation of [**redirects**](https://docs.netlify.com/routing/redirects/) and [**header**](https://docs.netlify.com/routing/headers/) rules for your Netlify site: you can easily configure custom headers, basic auth, redirect instructions and rewrite rules from your _nuxt config file_.

Based on nuxt 2 module `@aceforth/nuxt-netlify` : https://github.com/juliomrqz/nuxt-netlify/

## Usage

The default configuration will generate an empty `_redirects` file and a `_headers` file with some caching and security headers:

```text
# _headers

/*
  Referrer-Policy: origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block

/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache
```

> :warning: the `/_nuxt/*` reference automatically changes with the value of `build.publicPath`.

### Headers

The headers object represents a JS version of the [Netlify `_headers` file format](https://docs.netlify.com/routing/headers/). You should pass in a object with string keys (representing the paths) and an array of strings for each header. For example:


You can add extra headers as follows:

```js
const pkg = require('./package.json')

{
  netlify: { 
    headers: {
      '/*': [
        'Access-Control-Allow-Origin: *',
        `X-Build: ${pkg.version}`
      ],
      '/favicon.ico': [
        'Cache-Control: public, max-age=86400'
      ]
    }
  }
}
```

that will generate:

```text
# _headers

/*
  Referrer-Policy: origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Access-Control-Allow-Origin: *
  X-Build: 1.0.1

/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache
  
/favicon.ico
  Cache-Control: public, max-age=86400
```

### Redirects

You can also add [redirects](https://docs.netlify.com/routing/redirects/), as many as you like. You should pass in an array of objects with the redirection attributes. You can also pass in a `function` that returns the redirect array. For example:


```js
{
  netlify: { 
    redirects: [
      {
        from: '/home',
        to: '/'
      },
      {
        from: '/my-redirect',
        to: '/',
        status: 302,
        force: true
      },
      {
        from: '/en/*',
        to: '/en/404.html',
        status: 404
      },
      {
        from: '/*',
        to: '/index.html',
        status: 200
      },
      {
        from: '/store',
        to: '/blog/:id',
        query: {
          id: ':id'
        }
      },
      {
        from: '/',
        to: '/china',
        status: 302,
        conditions: {
          Country: 'cn,hk,tw'
        }
      }
    ]
  }
}
```

will generate:

```text
# _redirects

/home               /               301
/my-redirect        /               302!
/en/*               /en/404.html    404
/*                  /index.html     200
/store    id=:id    /blog/:id       301
/                   /china          302    Country=cn,hk,tw
```

