var exports = {};
var coder = exports;
//
// Remark: Code comments show code that gets generated
//
exports.code = function (resource) {
  var str = '';
  //
  // var Creature = resourceful.define('creature');
  //
  str += 'var ' + resource._resource + " = resourceful.define('" + resource.lowerResource +  "');\n\n";
  var schema = resource.schema.properties;
  Object.keys(schema).forEach(function(p){
    var type = schema[p].type.split('');
    type[0] = type[0].toUpperCase();
    type = type.join('');
    if (p !== 'id') {
      //
      // Creature.property('awesome', Boolean, {
      //
      str += resource._resource + '.property("' + p + '", ' + type + ', { \n';
      Object.keys(schema[p]).forEach(function(o, i){
        var comma = ",";
        if(i === Object.keys(schema[p]).length - 1) { // TODO: < 4 is a magic number, thats not right
          comma = "";
        }
        if(o !== "type" && o !== "messages" && o !== 'conditions') {
          var value = schema[p][o];
          if(Array.isArray(value)) {
            value = "['" + value.join("', '") + "']";
          } else if (type === "Number"){
            // do nothing
          } else if (type === "Boolean"){
            // do nothing
          } else {
            value =  '"' + value + '"';
          }
          //
          // "default": false,
          //
          str += '  "' + o + '": ' + value + '' + comma + ' \n';
        }
      });
      //
      // });
      //
      str += '});\n\n'
      
    }
  });
  //
  // For every remote method on the resource
  //
  for (var m in resource) {
    if(typeof resource[m] === "function" && resource[m].remote === true) {
      //
      // Creature.feed = function () {};
      //
      str += resource._resource + '.' + m + ' = ' + resource[m].toString() + ';\n';
      //
      // Creature.feed.remote = true;
      //
      
      str += resource._resource + '.remote = true;\n'
    }
  }
  return str;
};
