# Router
## NodeJS module

__Router__ for *NodeJS* is a minimalistic Routing plugin.

Using *regular expressions* like `/^a-literal-route$/g` you can trigger certain
callbacks.

* * *

## Usage
### Basic tutorial

Import the Router, this will give you a new instance of the `Router` Object:
```
const router = require('Router');
```

Then, all what you have to do is define some routes, using the `.when(...)`
method:
```
router
.when(/^\/getPlayers\/(.+)$/g, (url, response, match) => {

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write(`Player requested: ${match[1]}`);
  response.end();

})
.final((url, response) => {

  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end(`Unknown action ${url}`);

});
```

# Reference

## Router.prototype.when

`when(regExp, callback)`

__regExp__: The regular expression to match. I personally recommend to use
a regular expression that follows this pattern: `/^\/...$/g`, because you
ensure that the regular expression will match the whole route (Thanks to the
anchor characters `^` and `$`), plus all routes start with a forward slash.

__callback__: The function that will be called on route match. The arguments are
: `(url, response, match)`

## Router.prototype.final

`final(callback)`

__callback__: The function that will be called when no route is matched.
The arguments are: `(url, response)`
