# rfasqls [![npm version](https://badge.fury.io/js/rfasqls.svg)](https://badge.fury.io/js/rfasqls) [![Build Status](https://travis-ci.com/AqilCont/rfasqls.svg?branch=master)](https://travis-ci.com/AqilCont/rfasqls) [![Coverage Status](https://coveralls.io/repos/github/AqilCont/rfasqls/badge.svg?branch=master)](https://coveralls.io/github/AqilCont/rfasqls?branch=master)

This is a module made specifically for my(AqilCont)'s and his friends' use.

### Installation
    npm i rfasqls

## Discord
This feature was made to make making bots easier. Has some helpful functions too. Usage:
```js
const { discord } = require("rfasqls"),
      bot = new discord(client, { (Options) });
```

The object it returns also has its own custom event emitter. **Some useful events**:
 - `no-command`: When a message is sent and it is not a command recognized by the package.
 - `dm`: When the bot is "DM"ed.

#### Options
 - `name(String)`(required): Name of this bot
 - `prefix(String)`(required): The prefix
 - `admins(Array<String>)`: IDs of all the administrators of the bot. Info is mainly used for the `eval` feature.
 - `cats(Array<String>)`: Names of all the categories going to be included
 - `cooldowns(Object)`: Enables cooldowns(makes a user wait for a set amount of time before using a command again) and global cooldowns. Leave empty if you want them both to work. To set one or both of them off, input this into it: `{ cd: false, gcd: false }`
 ##### Eval
 A custom `eval` command for anyone to use.
 - `evalopt(Object)`: You can set the prefix and function through this. This is recommended opposed to `evalprefix` and/or `evalfunc`. Properties: `prefix(String)` and `func(Function)`
 - `evalprefix(String)`: Sets the custom prefix of the eval command. Eg. If the value is set to `r:`, the usage is `r: (code)`
 - `evalfunc(Function)`: Sets the function of the `eval` command
 ##### Messages
 Messages for certain event triggers like startup, cooldowns, and global cooldowns. Default messages are used if not set to anything.
 - `messages(Object)`: Messages for cooldowns... in an object. Properties:
   - `cd`: Cooldowns
   - `gcd`: Global cooldowns
   - `ready`: Bot Startup
 - `cdMessage`:

## Functions
Some helpful functions that shorten your code. To access the functions, you need to do this:
```js
const { functions } = require("rfasqls");
```

##### All Functions:
1. `random(min(Number), max(Number), round(Boolean))`: Spawns a random number from `min` to `max`. Rounds the number if you put `true` for the `round` argument.
2. `page_maker(array(Array), num(Number), page(Number), func(Function))`: You put in an array, then it executes the function including the `num` amount of values per "page". Specify the page number if you are not on page 1
3. `time(time(Number or String), type(string))`: Converts milliseconds into a string, and the ISO format into units of time. Has other secret functionalities too.
4. `bytes(bytes(Number))`: Converts a number into a unit of Bytes, MegaBytes, GigaBytes, or TerraBytes
5. `get_val(obj(Object), str(String))`: IDK how to explain this but its a cool function that can get values from objects with random strings. Returns false if value not found.
6. `parseUrl(url(String))`: Returns a promise that resolves with JSON from a given URL.
7. `capFirst(str(String))`: Capitalizes the first letter of each word in a string.
8. `check(arr(Object or Array), type(Array or String))`: This one is KINDA hard to explain and use. I would recommend ignoring it.
9. `equals(a(Anything), b(Anything), check_order(Boolean), crylic(Boolean))`: Returns true or false depending if `a` is equal to `b`. Most handy when working with objects, or other complex values.

## Events
This feature works a lot like the `events` module but is a lot simpler and has global events(events across the whole project). To access this feature, do this:
```js
const { events } = require("rfasqls");
```
In essence, the whole `events` object is an event emitter. You can call it anywhere and the same events will be called through your project(Example: `socket.io` except you need to do stuff to make it works with HTML).

To create a local Event Emitter, just do:
```js
const { events } = require("rfasqls"),
      e = new events();
```
This will create and return an object that only works in this file.

> BTW I didn't just spam type `rfasqls`... it is an abbreviation for something I _probably_ should have written down somewhere ;-;
