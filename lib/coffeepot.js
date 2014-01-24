/*
 * Coffee Pot is Client MVVM framework for JavaScript.
 *   Copyright (C) 2014, NISHIMOTO Keisuke.
 *     https://github.com/keisuken/coffeepot
 * coffeepot.js
 */


/*
 * String template method.
 * var result = "{0}, {1} world!".tmpl("Hello", "JavaScript");
 * result = "Hello, JavaScript world!"
 */
String.prototype.tmpl = function() {
  var text = this;
  var length = arguments.length;
  if (length === 0) {
    return text.replace(/\{\d+\}/g, '');
  } else {
    var str = text;
    for (var i = 0; i < length; i++) {
      var regexp = new RegExp("\\{" + i + "\\}", 'g');
      str = str.replace(regexp, arguments[i]);
    }
    return str.replace(/{\d+}/g, '');
  }
};


/**
 * Coffee Pot framekwork.
 */
var CoffeePot = {


  set: function(ViewModel, Model) {

    var toString = function(value) {
      return String(value);
    };

    var toInt = function(value) {
      if (typeof(value) !== 'number') {
        var value = value.replace(/[^0-9\.eE\+\-]+/g, '');
        value = value !== '' ? value: '0';
        return parseInt(value);
      } else {
        return Math.floor(value);
      }
    };

    var toFloat = function(value) {
      if (typeof(value) !== 'number') {
        var value = value.replace(/[^0-9\.eE\+\-]+/g, '');
        value = value !== '' ? value: '0';
        return parseFloat(value);
      } else {
        return Math.floor(value);
      }
    };

    var toBoolean = function(value) {
      switch (typeof(value)) {
        case 'boolean':
          return value;
        case 'number':
          return value > 0;
        default:
          var str = String(value);
          return value.lastIndexOf('t', 0) === 0 ||
                 value.lastIndexOf('T', 0) === 0;
      }
    };

    var defineProperty = function(obj, name, setter, getter) {
      Object.defineProperty(obj, name, {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
      });
    };

    /*----------------------------------------------------------------
      Set ViewModel and Model reference.
    ----------------------------------------------------------------*/
    ViewModel.Model = Model;
    Model.ViewModel = ViewModel;
    /*----------------------------------------------------------------
      Initialize ViewModel methods.
    ----------------------------------------------------------------*/
    var createVMMethod = function(name, method) {
      var method = ViewModel[name];
      if (typeof[method] === 'function') {
        ViewModel[name] = function() {
          method.apply(ViewModel, arguments);
        };
      }
    };
    for (var name in ViewModel) {
      createVMMethod(name);
    }
    /*----------------------------------------------------------------
      Binding DOM values.
    ----------------------------------------------------------------*/
    ViewModel.bind = function() {
      // Binds.
      var bindings = ViewModel.bindings;
      var valuesObj = $('<div/>');
      var values = valuesObj[0];
      ViewModel.values = values;
      if (typeof(bindings) === 'function') {
        bindings = bindings.apply(ViewModel, []);
        ViewModel.bindings = bindings;
      }
      var createBind = function(id, typ) {
        // case standard:
        //   'dom_type:value_type:reducer:formatter'
        // case with_action:
        //   ['dom_type:value_type:reducer:formatter',
        //     function(value) {...}
        //   ]
        // Preview DOM values.
        var previewValues = {};
        var action = null;
        if (typ instanceof Array) {
          action = typ[1];
          typ = typ[0];
        }
        // typs: [domType, valueType, reducer, formatter]
        var typs = typ.split(':');
        var domType = '';
        var valueType = '';
        if (typs.length < 2) {
          domType = typ;
          valueType = 'string';
        } else {
          domType = typs[0];
          valueType = typs[1];
        }
        // Converter
        var conv = null;
        switch (valueType) {
          case 'boolean':
            conv = toBoolean;
            break;
          case 'int':
            conv = toInt;
            break;
          case 'float':
            conv = toFloat;
            break;
          default:
            conv = toString;
        }
        // DOM binding.
        switch (domType) {
          case 'val':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                previewValues[id] = obj.val();
                obj.val(value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                var value = conv(obj.val());
                return value;
              }
            );
            obj.on('change mousedown keydown DOMAttrModified propertychange',
              function() {
                setTimeout(function() {
                  var value = obj.val();
                  if (previewValues[id] !== value) {
                    previewValues[id] = value;
                    var convertedValue = conv(value);
                    if (action) action.apply(ViewModel, [convertedValue]);
                  }
                }, 10);
              }
            );
            break;
          case 'attr':
            var ids = id.split('$');
            if (ids.length >= 2) {
              var domId = ids[0];
              var attrName = ids[1];
              var obj = $('#' + domId);
              defineProperty(values, id,
                function(value) {
                  obj.attr(attrName, value);
                  var convertedValue = conv(value);
                  if (action) action.apply(ViewModel, [convertedValue]);
                },
                function() {
                  return conv(obj.attr(attrName));
                }
              );
            }
            break;
          case 'class':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                obj.attr('class', value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                return conv(obj.attr('class'));
              }
            );
            break;
          case 'text':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                obj.text(value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                return conv(obj.text());
              }
            );
            break;
          case 'html':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                obj.html(value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                return obj.html();
              }
            );
            break;
        }
      };
      for (var id in bindings) {
        var typ = bindings[id];
        createBind(id, typ);
      }
      // Events.
      var events = ViewModel.events;
      if (typeof(events) === 'function') {
        events = events.apply(ViewModel, []);
        ViewModel.events = events;
      }
      var createEvent = function(obj, typ, action) {
        obj.on(typ, function(event) {
          action.apply(ViewModel, [event]);
        });
      };
      for (var id in events) {
        var eventSet = events[id];
        var obj = $('#' + id);
        for (var typ in eventSet) {
          var action = eventSet[typ];
          createEvent(obj, typ, action);
        }
      }
    };
    // Unbind method.
    ViewModel.unbind = function() {
      var events = ViewModel.events;
      for (var id in events) {
        var obj = $('#' + id);
        var eventSet = events[id];
        for (var typ in eventSet) {
          var action = eventSet[typ];
          obj.off(typ, action);
        }
      }
    };
    /*----------------------------------------------------------------
      Initialize Model methods.
    ----------------------------------------------------------------*/
    Model.ViewModel = ViewModel;
    // Methods.
    var createMMethod = function(name) {
      var method = Model[name];
      if (typeof[method] === 'function') {
        Model[name] = function() {
          method.apply(Model, arguments);
        };
      }
    };
    for (var name in Model) {
      createMMethod(name);
    }
    /*----------------------------------------------------------------
      Invoke  developer's initialize logic.
    ----------------------------------------------------------------*/
    ViewModel.bind();
    if (ViewModel.init !== undefined) {
      ViewModel.init.apply(ViewModel, []);
    }
    if (Model.init !== undefined) {
      Model.init.apply(Model, []);
    }
  }
};

// Alias Coffee Pot object.
var CP = CoffeePot;
