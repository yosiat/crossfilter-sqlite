# Crossfilter-SQLite

Crossfilter with SQLite as a backend, for filtering data which is larger than the maximum heap size of javascript, and still using the dc.js & crossfilter magic of
slicing and dicing.

## How to use?
```javascript
var sc = require('crossfilter-sql');

var sqlConnectionInformation = new sc.SqlConnectionInformation("DB_FILE", "DB_TABLE");
var sqlCrossfilter = new sc.SqlCrossfilter(sqlConnectionInformation);

// Create dimension based on "type" and "method" columns in "DB_TABLE"
var typeDimension =  sqlCrossfilter.dimension("type");
var methodDimension =  sqlCrossfilter.dimension("method");

// Use evaluateAll to evaluate all queries, to create the initial groups
sqlCrossfilter.evaluateAll().then(function() {
  // Then filter the dimensions
  typeDimension.filter("string");
  
  // And call again to evaluateAll, after filtering
  sqlCrossfilter.evaluateAll().then(function() {
    //... do something in here
  });
});
```

## How does this connects to dc.js?
The idea is to use [dc.js commitHandler](https://github.com/dc-js/dc.js/blob/58766e518a6e171c18a057e2886ff4d7b7fe4fdf/web/docs/api-latest.md#dc.baseMixin+commitHandler),
on the commitHandler function call the evaluateAll and then call the commitHandler callback, and dc will do the rest.

## Is it working? completed?
This project is in the POC phase, most of the group/dimension methods aren't implemented (like top, reduceCount, groupAll - etc).

## Contribute
If you want to contribute in this very young phase of the project, you can do one of this:
* Add docs about how to use this library
* Add tests (Hopefully, I will add some tests in the future)
* Implemented the crossfilter api fully
* If you find any bug - create an issue :)



