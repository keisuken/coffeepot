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

    var num2comma3 = function(n) {
      if (typeof(n) !== 'number') {
        var str = String(n).trim().replace(/[^0-9\.eE\-\+]+/g, '');
        str = str !== '' ? str : '0';
        n = parseFloat(str);
      }
      var result = '';
      var minus = n < 0 ? '-' : '';
      var str = '' + Math.abs(n);
      var i = str.indexOf('.');
      var floatStr = i >= 0 ? str.substring(i) : '';
      var intStr = i >= 0 ? str.substring(0, i) : str;
      result = intStr.substring(intStr.length - 3);
      intStr = intStr.substring(0, intStr.length - 3);
      while (intStr.length > 0) {
        result = intStr.substring(intStr.length - 3) + ',' + result;
        intStr = intStr.substring(0, intStr.length - 3);
      }
      result = minus + (result === '' ? '0' : result) + floatStr;
      return result;
    };
    
    var num2comma4 = function(n) {
      if (typeof(n) !== 'number') {
        var str = String(n).trim().replace(/[^0-9\.eE\-\+]+/g, '');
        str = str !== '' ? str : '0';
        n = parseFloat(str);
      }
      var result = '';
      var minus = n < 0 ? '-' : '';
      var str = '' + Math.abs(n);
      var i = str.indexOf('.');
      var floatStr = i >= 0 ? str.substring(i) : '';
      var intStr = i >= 0 ? str.substring(0, i) : str;
      result = intStr.substring(intStr.length - 4);
      intStr = intStr.substring(0, intStr.length - 4);
      while (intStr.length > 0) {
        result = intStr.substring(intStr.length - 4) + ',' + result;
        intStr = intStr.substring(0, intStr.length - 4);
      }
      result = minus + (result === '' ? '0' : result) + floatStr;
      return result;
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
        // Binding action.
        var action = null;
        if (typ instanceof Array) {
          action = typ[1];
          typ = typ[0];
        }
        // typs: domType:valueType:reducers:formatter
        var typs = typ.split(':');
        var domType = 'text';
        var valueType = 'string';
        var reducers = [];
        var formatter = null;
        if (typs.length >= 1) {
          domType = typs[0];
        }
        if (typs.length >= 2) {
          valueType = typs[1];
        }
        if (typs.length >= 3) {
          reducerExps = typs[2].split("\,");
          for (var i = 0; i < reducerExps.length; i++) {
            var reducerExp = reducerExps[i];
            var reducerTokens = /(\w+)(\(([^\)]*)\))?/.exec(reducerExp);
            if (reducerTokens) {
              var reducerName = reducerTokens[1];
              var reducerArg = reducerTokens[3];
              switch (reducerName) {
                case 'trim':
                  reducers.push(function(value) {return value.trim();});
                  break;
                case 'max':
                  if (reducerArg !== undefined) {
                    var length = parseInt(reducerArg);
                    reducers.push(function(value) {return value.length <= length ? value : value.substring(0, length);});
                  }
                  break;
                case 'default':
                  if (reducerArg !== undefined) {
                    reducers.push(function(value) {return value !== '' ? value : reducerArg;});
                  }
                  break;
              }
            }
          }
        }
        if (typs.length >= 4) {
          formatterName = typs[3];
          switch (formatterName) {
            case 'comma3':
              formatter = num2comma3;
              break;
            case 'comma4':
              formatter = num2comma4;
              break;
          }
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
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                if (formatter !== null) value = formatter(value);
                obj.val(value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                var value = obj.val();
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                return conv(value);
              }
            );
            var updateHandler = function(event) {
              setTimeout(function() {
                var value = obj.val();
                if (previewValues[id] !== value) {
                  previewValues[id] = value;
                  obj.val(value);
                  var convertedValue = conv(value);
                  if (action) action.apply(ViewModel, [convertedValue]);
                }
              }, 10);
            };
            var changeHandler = function(event) {
              setTimeout(function() {
                var value = obj.val();
                if (previewValues[id] !== value) {
                  previewValues[id] = value;
                  for (var i = 0; i < reducers.length; i++) {
                    value = reducers[i](value);
                  }
                  if (formatter !== null) value = formatter(value);
                  obj.val(value);
                  var convertedValue = conv(value);
                  if (action) action.apply(ViewModel, [convertedValue]);
                }
              }, 10);
            };
            obj.on({
              mousedown: updateHandler,
              keydown: updateHandler,
              change: changeHandler,
              blur: changeHandler,
              DOMAttrModified: changeHandler,
              propertychange: changeHandler
            });
            break;
          case 'attr':
            var ids = id.split('$');
            if (ids.length >= 2) {
              var domId = ids[0];
              var attrName = ids[1];
              var obj = $('#' + domId);
              defineProperty(values, id,
                function(value) {
                  for (var i = 0; i < reducers.length; i++) {
                    value = reducers[i](value);
                  }
                  if (formatter !== null) value = formatter(value);
                  obj.attr(attrName, value);
                  var convertedValue = conv(value);
                  if (action) action.apply(ViewModel, [convertedValue]);
                },
                function() {
                  var value = conv(obj.attr(attrName));
                  for (var i = 0; i < reducers.length; i++) {
                    value = reducers[i](value);
                  }
                  return conv(value);
                }
              );
            }
            break;
          case 'class':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                if (formatter !== null) value = formatter(value);
                obj.attr('class', value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                var value = obj.attr('class');
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                return conv(value);
              }
            );
            break;
          case 'text':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                if (formatter !== null) value = formatter(value);
                obj.text(value);
                var convertedValue = conv(value);
                if (action) action.apply(ViewModel, [convertedValue]);
              },
              function() {
                var value = obj.text();
                for (var i = 0; i < reducers.length; i++) {
                  value = reducers[i](value);
                }
                return conv(value);
              }
            );
            break;
          case 'html':
            var obj = $('#' + id);
            defineProperty(values, id,
              function(value) {
                obj.html(value);
                if (action) action.apply(ViewModel, [value]);
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
