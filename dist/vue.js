(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组的部分方法
  var oldArrayProto = Array.prototype;

  // newArrayProto.__proto__ = oldArrayProto
  var newArrayProto = Object.create(oldArrayProto);
  var methods = [
  // 可以改变原数组的方法
  "push", "pop", "shift", "unshift", "reverse", "sort", "slpice"];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
      var ob = this.__ob__;

      // 对数组新增的值进行劫持
      var inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          // arr.splice(index, howmany, {a: 1}, {a: 1})
          inserted = args.slice(2);
          break;
      }
      if (inserted) {
        // 如果存在新增值，进行劫持
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      // 这里添加属性 '__ob__' 带来的好处有两个
      // 1、是为了把Observe的实例的原型方法放到数据上，这样./array.js里面重写的数组方法中新增的数据劫持可以能调用obseveArray方法
      // 2、可以作为判断对象是否被劫持过
      // data.__ob__ = this; // 这么写会造成死循环，因为如果data是对象的话会新增一个—__ob__属性，在下面的defineReactive中会造成死循环，所以可以将这个属性设置为不可枚举，如下写法：
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto; // 需要保留数组的特性，并且可以重写部分方法
        this.observeArray(data); // 如果数组中存在对象，需劫持
      } else {
        this.walk(data);
      }
    }
    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observe;
  }();
  function defineReactive(target, key, value) {
    // 如果value是对象，递归劫持
    observe(value);

    // "重新定义"属性 比较耗性能
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 设置值的时候如果是对象也进行递归劫持

        value = newValue;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== "object" || data === null) return;

    // 判断是否已经被劫持过
    if (data.__ob__ instanceof Observe) {
      return data.__ob__;
    }

    // 只对没有被劫持的对象做劫持
    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    // if (opts.props) {}

    if (opts.data) {
      initData(vm);
    }

    // if (opts.computed) {}
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data;
    observe(data);

    // 将vm._data用vm来代理
    for (var key in data) {
      proxy(vm, "_data", key);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      // vm.name
      get: function get() {
        return vm[target][key]; // vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;

      // 初始化状态
      initState(vm);
    };
  }

  // 声明Vue构造函数
  function Vue(options) {
    // 这里调用的实例方法都在下面扩展来的
    this._init(options);
  }

  // 扩展Vue的原型方法
  initMixin(Vue); // 扩展初始化方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
