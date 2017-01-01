'use strict'
/**
* Simplistic Routing Module
* NodeJS Regular expression routing.
* ---
* Argochamber Interactive 2016
* by Pablo 'sigmasoldier' Blanco Celdrán
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

/**
* This is an atomic hanler.
* Those store simple data as the callback.
*/
class Handler {

  constructor(regex, callback, passable){
    this.callback = callback;
    this.regex = regex;
    this.isPassable = () => {
      return passable;
    };
  }

}

/**
* The router module grants you a routing system using regexp.
* Is like using if ... else if ... else with regexp.
*/
class Router {

 constructor(){
   this.__routes = [];
   this.__final = () => {};
 }

 /**
  * Called when the router wants to handle an incoming connection.
  * When specify blocking routes.
  * That means that if the next callback is not a 'if' the regular expression
  * is not even tested.
  */
 when(regex, callback) {
   this.__routes.push(new Handler(regex, callback, false));
   return this;
 };

 /**
  * Those are tested even if the previous regex was true.
  [NEXT VERSION IMPL]
  */
 /*this.also = (regex, callback) => {
   this.__routes.push(new Handler(regex, callback, true));
   return this;
 };*/

 /**
  * This is called if noone of the when routes has been matched.
  */
 final(handler) {
   this.__final = handler;
 };

 /**
  * Now this iterator gives us only routes while either: Noone was matched or
  * the next incoming routes are passable. [NEXT VERSION IMPL]
  */
  getRoutesIterator(url){
    const self = this;
    return (function*(url){
      yield* [...self.__routes];
    })(url);
    /*let exit = false;
    let i = 0;
    while (!exit){

     yield this.__routes[i++];
    }*/
 }

 /**
  * Call this when do you want to apply a route to an incoming URL.
  * Deprecation warning!
  * Now request & response has backwards compatibility with only response.
  * The next version will drop this backwards compatibility.
  */
 listen(url, request, response) {
   let exit = false;
   let routes = this.getRoutesIterator(url);
   let last = {done: false};
   while (!exit && !last.done){
     last = routes.next();
     if (!last.done){
       if (last.value.regex.test(url)){
         let match = url.match(last.value.regex);
         if (typeof response === 'undefined'){
           last.value.callback(url, request, match);
         } else {
           last.value.callback(url, request, response, match);
         }
         exit = true;
       }
     }
   }
   if (!exit){
     if (typeof response === 'undefined'){
       this.__final(url, request);
     } else {
       this.__final(url, request, response);
     }
   }
 }

};

//Expose the module.
module.exports = new Router();
