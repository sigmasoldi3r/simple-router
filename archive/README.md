# OLD README
## For versions prior 2.0.0

# Router
## NodeJS module

__Router__ for *NodeJS* is a minimalistic Routing plugin.

Using *regular expressions* like `/^\/a-literal-route$/` you can trigger certain
callbacks.

#### Background

This module was born with the idea of personal use only, because I needed
something that could easily define a certain logic for server routes without
having an huge amount of `if...else` blocks. Now, seeing that the module is
being used I've decided to write down a readme.

* * *

## Usage
### Basic tutorial

Import the Router, this will give you a new instance of the `Router` Object:
```js
const router = require('Router');
```

Then, all what you have to do is define some routes, using the `.when(...)`
and `.final(...)` method:
```js
router
.when(/^\/getPlayers\/(.+)$/, (url, [request,] response, match) => {

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write(`Player requested: ${match[1]}`);
  response.end();

})
.final((url, [request,] response) => {

  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end(`Unknown action ${url}`);

});
```

Then, in your __HTTP__ server _callback_, use the `router.listen(url, [request,] response)`
method call, like this:
```js
const PORT = 80;

http.createServer((request, response) => {

  // No more logic here folks!
  router.listen(request.url, [request,] response);

}).listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`);
});
```

### Global Routing

If you want to define a `.when(...)` anywhere, in other files, all what you have
to do is require the `GlobalRouter` module in your main file, this will expose
a __router__ object _globally_.

Let's supouse that this is your main file:
```js
'use strict'
// Import them.
const http = require('http');
require('GlobalRouter');
require('./APageRoute.js');

http.createServer((request, response) => {

  router.listen(request.url, [request,] response);

}).listen(80);
```

Then, your __APageRoute.js__ file can look like this:
```js
'use strict'
//This is my page.

let users = {
  "foo": "bar",
  "bar": "foobar",
  "fooing": "baring"
};

router.when(/^\/users\/([^\/]+$)/, (url, [request,] response, match) => {

  let usr = users[match[1]];

  if (typeof usr === 'undefined'){
    response.writeHead(400, {'Content-Type': 'plain/text'});
    response.end(`Unknown user ${match[1]}`);
  } else {
    response.writeHead(200, {'Content-Type': 'plain/text'});
    response.end(usr);
  }

});
```

# Reference

## Router.prototype.when

`when(regExp, callback)`

__regExp__: The regular expression to match.

I personally recommend to use
a regular expression that follows this pattern: `/^\/...$/`, because you
ensure that the regular expression will match the whole route (Thanks to the
anchor characters `^` and `$`). Global flag will not match the whole route if
you're using captures, so use the anchor characters.

If you enable the global flag `/.*/g` and use the anchors `/^.*$/` at the same
time, it __will not__ match any _URL_! So beware.

All routes shall start with a forward slash.

__callback__: The function that will be called on route match. The arguments are
: `(url, [request,] response, match)`

## Router.prototype.final

`final(callback)`

__callback__: The function that will be called when no route is matched.
The arguments are: `(url, [request,] response)`
