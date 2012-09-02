/*

  resource-builder.js

  working, but not very well built right now, more of a prototype

  should refactor this into viewful views, should be easy...

*/

var description = {
  "default": "",
  "description": "the description of the property"
};

var message = {
  "default": "",
  "description": "custom error message to be shown on error"
};

var conform = {
  "default": function(val) {
    return val;
  },
  "description": "value must satisify this custom method"
};

var fakeSchema = {
  
  "String": {
    "default": {
      "default": "",
      "description": "the default value ( a string )"
    },
    "description": description,
    "format": {
      "default": "",
      "description": "the description of the property",
      "formats": {
        "email": {},
        "url": {}
      }
    },
    "message": message,
    "minLength": {
      "default": 0,
      "description": "the minimum length of the string"
    },
    "maxLength": {
      "default": 10,
      "description": "the maximum length of the string"
    },
    "enum": {
      "default": "[]",
      "description": "value must be contained in this array"
    },
    "pattern": {
      "default": new RegExp(),
      "description": "value must satisify this regex pattern"
    },
    "conform": conform
  },

  "Number": {
    "default": {
      "default": 0,
      "description": "the default value ( a number )"
    },
    "description": description,
    "message": message,
    "minimum": {
      "default": 0,
      "description": "the default value ( a number )"
    },
    "maximum": {
      "default": 0,
      "description": "the default value ( a number )"
    },
    "conform": conform
  },

  "Boolean": {
    "default": {
      "default": false,
      "description": "the default value ( a boolean )"
    },
    "description": description,
    "message": message
  },

  "Array": {
    "default": {
      "default": "[]",
      "description": "the default value ( an array )"
    },
    "description": description,
    "message": message
  },

  "Object": {
    "default": {
      "default": "{}",
      "description": "the default value ( an object )"
    },
    "description": description,
    "message": message
  }

};

var Resource = {};


$(document).ready(function(){
  

  var type = false, property = false, Prop = "String";

  //
  // properties mouse bindings
  //
    $('.properties dl dt').mouseover(function(){
      if(type === false) {
        $('.description').html($(this).next('dd').html());
        $(this).addClass('label label-inverse');
      }
    })
  
    $('.properties dl dt').mouseout(function(){
      if (type === false) {
        $(this).removeClass('label label-inverse');
      }
    })

    $('.properties dl dt').click(function(){
      var that = this;
      type = true;
      $('.control-group').removeClass('error');
      $('.properties dl dt').removeClass('label label-inverse');
      //$('.options dl dt').hide();
      $(this).addClass('label label-inverse');
      $('.options dl dt').each(function(i, item){
        if($(item).hasClass($(that).html())) {
          $(item).show();
        }
      });
      $('#property_name').val('');
      $('#property_type').val($(that).html());

      $('.options dl dt').hide();

      //
      // Show options available from schema 
      //
      $('.options dl dt').each(function(i, item){
        for (var s in fakeSchema[$(that).html()] ){
          if($(item).html() === s) {
            Prop = $(that).html();
            $(item).show();
          }
        }
      });

      $('.options dl dt:first').click();
      $('#property_name').focus();

    });
  //
  // END properties mouse bindings
  //


  //
  // options mouse bindings
  //
    $('.options dl dt').mouseover(function(){
      if (property === false) {
        $('.description').html($(this).next('dd').html());
        $(this).addClass('label label-inverse');
      }
    });

    $('.options dl dt').mouseout(function(){
      if (property === false) {
        $(this).removeClass('label label-inverse');
      }
    })

    $('.options dl dt').click(function(){
      property = true;
      $('.control-group').removeClass('error');
      $('.options dl dt').removeClass('label label-inverse');
      $(this).addClass('label label-inverse');
      
      
      $('#option_name').val($(this).html());

      $('.description').html(fakeSchema[Prop][$(this).html()].description);
      $('#option_value').val(fakeSchema[Prop][$(this).html()].default);
      
      
      
    });
  //
  // END properties mouse bindings
  //

  
  //
  // Property Form
  //
    $('#addProp').click(function(){
      var f = false;
      var n, t;
      
      var property_name = $('#property_name').val(),
      property_type = $('#property_type').val();
      
      n = $('#property_name').val();
      t = $('#property_type').val();
      if(n.length === 0) {
        $('#property_name').closest('.control-group').addClass('error');
        $('#property_name').attr('placeholder', 'is required...')
        return false;
      }
      $('.props .controls').each(function(e, item){
        if($(item).attr('data-name') === property_name){
          $(item).addClass('error');
          $('#property_name').closest('.control-group').addClass('error');
          $('#property_name').attr('placeholder', 'already exists...')
          f = true;
          return false;
        }
      });
      if(f) {
        return false
      }

      var str = '\
      <div class="control-group property">\
        <div class="controls" data-name="' + property_name + '" data-type="' + property_type + '">\
          <table class="table table-bordered table-condensed table-hover">\
            <tr>\
              <th>' + property_name + '</th>\
              <th><em>' + property_type + '</em></th>\
              <th><a class="remove" href="#/remove">X</a></th>\
            </tr>\
          </table>\
        </div>\
      </div>';

      $('.props').append(str);
      $('#code').val(coder.code(serializeTable()));
      $('#property_name').closest('.control-group').removeClass('error');
      $('table tr').removeClass('error');
      $('#option_value').focus();
      return false;
    });
  //
  // END Property Form
  //

  //
  // Options form
  //
    $('#addType').click(function(){

      var f = false;
      var n, t, c;
      c = $('#option_name').val();
      n = $('#property_name').val();
      t = $('#option_value').val();

      var property_name = $('#property_name').val(),
          option_key = $('#option_name').val(),
          option_value =  $('#option_value').val();

      if(c.length === 0) {
        $('#option_name').closest('.control-group').addClass('error');
        $('#option_name').attr('placeholder', 'is required...')
        return false;
      }

      $('table .option').each(function(e, item){
        var p = $('td', $(this));
        if(p.get(1).innerHTML === c) {
          $('#option_name').closest('.control-group').addClass('error');
          $('#option_name').attr('placeholder', 'already exists...')
          $(item).addClass('error');
          f = true;
          return false;
        }
      });

      if(f) {
        return false
      }

      //
      // Find the current property
      //
      $('.props .controls').each(function(i, item){
        if($(item).attr('data-name') === property_name){
          $('tbody', item).append('<tr><td>' + option_key + '</td><td>' + option_value + '</td><td><a href="#/remove" class="remove">X</td></tr>');
        }
      });

      $('#code').val(coder.code(serializeTable()));

      $('#option_value').val('');
      var x = 0, l = $('.options dl dt').length;
      $('.options dl dt').each(function(e, item){ 
        if($(item).hasClass('label-inverse')) { 
          x = e;
        }
      });

      x = Number(x) + 1;
      if(typeof $('.options dl dt').get(x) !== 'undefined') {
        $('.options dl dt').get(x).click();
        if(x > l){
          $('#property_name').val('');
          $('#property_name').focus('');
        }
      }
      return false;
    });
  //
  // END Property Form
  //
  
  
  //
  // Resource table
  //
    $('table tr').live('mouseover', function(){
      console.log('ss')
    });

    $('table tr').live('click', function(e){
      if(e.target.tagName === "A"){
        //
        // Delegate any link clicks somewhere else
        //
        return false;
      }
      var p = $(this).closest('.prop');
      p = $('td', p);
      $('#property_name').val(p.get(0).innerHTML);
      $('#property_value').val(p.get(1).innerHTML);
      $('table tr').removeClass('info');
      $(this).addClass('info');
      $('#option_value').focus()
    });

    $('.remove').live("click", function(){
      var close = $(this).closest('tr');
      console.log(close.html(), $('.props tr:first').html())
      if(close.html() === $('.props tr:first').html()) {
        $(this).closest('.property').remove();
      } else {
        close.remove();
      }
      $('#code').val(coder.code(serializeTable()));
    
    });

  //
  // END Resource table
  //

  //
  // Start events
  //
  $('.properties dl dt:first').click();
  $('#property_name').val('').focus();
  $('#option_name').val('');
  setTimeout(function(){
    $('.options dl dt:first').click();
  }, 1)

});

function serializeTable(){
  var resource = {};
  resource._resource = "Creature";
  resource.lowerResource = "creature";
  resource.schema = {};
  resource.schema.properties = {};

  $('.props .property .controls').each(function(i, item){
    resource.schema.properties[$(item).attr('data-name')] = {};
    resource.schema.properties[$(item).attr('data-name')]['type'] = $(item).attr('data-type');
    
    $('tr', item).each(function(i, etem){
      if(i > 0) {
        var key = $('td', etem).get(0).innerHTML,
            value = $('td', etem).get(1).innerHTML;
        resource.schema.properties[$(item).attr('data-name')][key] = value;
      }
    })
  });
  console.log(resource)
  return resource;
}
