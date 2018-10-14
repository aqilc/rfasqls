# rfasqls [![npm version](https://badge.fury.io/js/rfasqls.svg)](https://badge.fury.io/js/rfasqls) [![Build Status](https://travis-ci.com/AqilCont/rfasqls.svg?branch=master)](https://travis-ci.com/AqilCont/rfasqls) [![Coverage Status](https://coveralls.io/repos/github/AqilCont/rfasqls/badge.svg?branch=master)](https://coveralls.io/github/AqilCont/rfasqls?branch=master)

This is a module made specifically for my(AqilCont)'s and his friends' use.

### Installation
```
npm i rfasqls
```

## Discord
Usage:
```js
const rfasqls_discord = require("rfasqls").discord,
      rfa_bot = new rfasqls(client, { (Options) });
```
The object it returns also has its own custom event emitter. Some useful events:
 - `no-command`: When a message is send and it is not a command recognized by the package.
 - `dm`: When the bot is DMed.
#### Options
 - `name(String)`(required): Name of this bot
 - `prefix(String)`(required): The prefix
 - `admins(Array<String>)`: IDs of all the administrators of the bot. Info is mainly used for the eval feature.
 - `cats(Array<String>)`: Names of all the categories going to be included
 - `cooldown(Boolean)`: Enables cool-downs
 - `evalprefix(String)`: 


## Functions
To access the functions, you need to do this:
```js
const rfasqls_functions = require("rfasqls").functions;
```

##### Some functions include:
1. `random(min(Number), max(Number), round(Boolean))`: Spawns a random number from `min` to `max`. Rounds the number if you put `true` for the `round` argument.
2. `page_maker(array(Array), num(Number), page(Number), func(Function))`: You put in an array, then it executes the function including the `num` amount of values per "page". Specify the page number if you are not on page 1
3. `time(time(Number or String), type(string))`: Converts milliseconds into a string, and the ISO format into units of time. Has other secret functionalities too.
4. `bytes(bytes(Number))`: Converts a number into a unit of Bytes, MegaBytes, GigaBytes, or TerraBytes
5. `get_val(obj(Object), str(String))`: IDK how to explain this but its a cool function that can get values from objects with random strings. Returns false if value not found.
6. `parseUrl(url(String))`: Returns a promise that resolves with JSON from a given URL.
7. `capFirst(str(String))`: Capitalizes the first letter of each word in a string.
8. `check(arr(Object or Array), type(Array or String))`: This one is KINDA hard to explain and use. I would recommend ignoring it.
9. `equals(a(Anything), b(Anything), check_order(Boolean), crylic(Boolean))`: Returns a boolean depending if `a` is equal to `b`. Most handy when working with objects, or other complex values.

> BTW I didn't just spam type `rfasqls`... it is an abbreviation for something i should have written down ;-;
