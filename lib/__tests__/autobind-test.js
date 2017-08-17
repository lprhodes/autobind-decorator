'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('core-js/modules/es6.reflect');

require('core-js/modules/es6.symbol');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

describe('autobind method decorator', function () {
  var _desc, _value, _class;

  var A = (_class = function () {
    function A() {
      _classCallCheck(this, A);

      this.value = 42;
    }

    _createClass(A, [{
      key: 'getValue',
      value: function getValue() {
        return this.value;
      }
    }]);

    return A;
  }(), (_applyDecoratedDescriptor(_class.prototype, 'getValue', [_2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'getValue'), _class.prototype)), _class);


  it('binds methods to an instance', function () {
    var a = new A();
    var getValue = a.getValue;
    (0, _assert2.default)(getValue() === 42);
  });

  it('binds method only once', function () {
    var a = new A();
    (0, _assert2.default)(a.getValue === a.getValue);
  });

  /** parse errors. Submitted issue to babel #1238
  it('binds methods with symbols as keys', function () {
    var symbol = Symbol('method');
    class A {
      constructor () {
        this.val = 42;
      }
      @autobind
      [symbol] () {
        return this.val;
      }
    }
    let a = new A();
    let getValue = a[symbol];
    assert(getValue() === 42);
  });
  */

  it('throws if applied on a method of more than zero arguments', function () {
    _assert2.default.throws(function () {
      var _desc2, _value2, _class2;

      var A = (_class2 = function () {
        function A() {
          _classCallCheck(this, A);
        }

        _createClass(A, [{
          key: 'value',
          get: function get() {
            return 1;
          }
        }]);

        return A;
      }(), (_applyDecoratedDescriptor(_class2.prototype, 'value', [_2.default], Object.getOwnPropertyDescriptor(_class2.prototype, 'value'), _class2.prototype)), _class2);
    }, /@autobind decorator can only be applied to methods/);
  });

  it('should not override bound instance method, while calling super method with the same name', function () {
    var _desc3, _value3, _class3;

    // eslint-disable-line max-len
    var B = (_class3 = function (_A) {
      _inherits(B, _A);

      function B() {
        _classCallCheck(this, B);

        return _possibleConstructorReturn(this, (B.__proto__ || Object.getPrototypeOf(B)).apply(this, arguments));
      }

      _createClass(B, [{
        key: 'getValue',
        value: function getValue() {
          return _get(B.prototype.__proto__ || Object.getPrototypeOf(B.prototype), 'getValue', this).call(this) + 8;
        }
      }]);

      return B;
    }(A), (_applyDecoratedDescriptor(_class3.prototype, 'getValue', [_2.default], Object.getOwnPropertyDescriptor(_class3.prototype, 'getValue'), _class3.prototype)), _class3);


    var b = new B();
    var value = b.getValue();
    value = b.getValue();

    (0, _assert2.default)(value === 50);
  });
});

describe('autobind class decorator', function () {
  var _class4;

  var symbol = Symbol('getValue');

  var A = (0, _2.default)(_class4 = function () {
    function A() {
      _classCallCheck(this, A);

      this.value = 42;
    }

    _createClass(A, [{
      key: 'getValue',
      value: function getValue() {
        return this.value;
      }
    }, {
      key: symbol,
      value: function value() {
        return this.value;
      }
    }]);

    return A;
  }()) || _class4;

  it('binds methods to an instance', function () {
    var a = new A();
    var getValue = a.getValue;
    (0, _assert2.default)(getValue() === 42);
  });

  it('binds method only once', function () {
    var a = new A();
    (0, _assert2.default)(a.getValue === a.getValue);
  });

  it('ignores non method values', function () {
    _assert2.default.doesNotThrow(function () {
      var _class5;

      var A = (0, _2.default)(_class5 = function () {
        function A() {
          _classCallCheck(this, A);
        }

        _createClass(A, [{
          key: 'value',
          // eslint-disable-line no-unused-vars
          get: function get() {
            return 1;
          }
        }]);

        return A;
      }()) || _class5;
    });
  });

  it('does not override itself when accessed on the prototype', function () {
    A.prototype.getValue; // eslint-disable-line no-unused-expressions

    var a = new A();
    var getValue = a.getValue;
    (0, _assert2.default)(getValue() === 42);

    var foo = {
      value: 10,
      getValue: A.prototype.getValue
    };

    _assert2.default.equal(foo.getValue(), 10);
  });

  describe('with Reflect', function () {
    describe('with Symbols', function () {
      it('binds methods with symbol keys', function () {
        var a = new A();
        var getValue = a[symbol];
        (0, _assert2.default)(getValue() === 42);
      });
    });
  });

  describe('without Reflect', function () {
    // remove Reflect pollyfill
    var _Reflect = Reflect;
    var A = void 0;

    before(function () {
      var _class6;

      Reflect = undefined;

      var B = (0, _2.default)(_class6 = function () {
        function B() {
          _classCallCheck(this, B);

          this.value = 42;
        }

        _createClass(B, [{
          key: 'getValue',
          value: function getValue() {
            return this.value;
          }
        }, {
          key: symbol,
          value: function value() {
            return this.value;
          }
        }]);

        return B;
      }()) || _class6;

      A = B;
    });

    after(function () {
      Reflect = _Reflect;
    });

    it('falls back to Object.getOwnPropertyNames', function () {
      var a = new A();
      var getValue = a.getValue;
      (0, _assert2.default)(getValue() === 42);
    });

    describe('with Symbols', function () {
      it('falls back to Object.getOwnPropertySymbols', function () {
        var a = new A();
        var getValue = a[symbol];
        (0, _assert2.default)(getValue() === 42);
      });
    });

    describe('without Symbols', function () {
      var _Symbol = Symbol;
      var _getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var A = void 0;

      before(function () {
        var _class7;

        Symbol = undefined;
        Object.getOwnPropertySymbols = undefined;

        var B = (0, _2.default)(_class7 = function () {
          function B() {
            _classCallCheck(this, B);

            this.value = 42;
          }

          _createClass(B, [{
            key: 'getValue',
            value: function getValue() {
              return this.value;
            }
          }]);

          return B;
        }()) || _class7;

        A = B;
      });

      after(function () {
        Symbol = _Symbol;
        Object.getOwnPropertySymbols = _getOwnPropertySymbols;
      });

      it('does throws no error if Symbol is not supported', function () {
        var a = new A();
        var getValue = a.getValue;
        (0, _assert2.default)(getValue() === 42);
      });
    });
  });
});

describe('set new value', function () {
  var _desc4, _value4, _class8;

  var A = (_class8 = function () {
    function A() {
      _classCallCheck(this, A);

      this.data = 'A';
      this.foo = 'foo';
      this.bar = 'bar';
    }

    _createClass(A, [{
      key: 'noop',
      value: function noop() {
        return this.data;
      }
    }]);

    return A;
  }(), (_applyDecoratedDescriptor(_class8.prototype, 'noop', [_2.default], Object.getOwnPropertyDescriptor(_class8.prototype, 'noop'), _class8.prototype)), _class8);


  var a = new A();

  it('should not throw when reassigning to an object', function () {
    a.noop = {
      foo: 'bar'
    };
    _assert2.default.deepEqual(a.noop, {
      foo: 'bar'
    });
    _assert2.default.equal(a.noop, a.noop);
  });

  it('should not throw when reassigning to a function', function () {
    a.noop = function noop() {
      return this.foo;
    };
    _assert2.default.equal(a.noop(), 'foo');
    var noop = a.noop;
    _assert2.default.equal(noop(), 'foo');
    _assert2.default.equal(a.noop, a.noop);
  });

  it('should not throw when reassigning to a function again', function () {
    a.noop = function noop2() {
      return this.bar;
    };
    (0, _assert2.default)(a.noop(), 'bar');
    var noop2 = a.noop;
    _assert2.default.equal(noop2(), 'bar');
    _assert2.default.equal(a.noop, a.noop);
  });

  it('should not throw when reassigning to an object after bound a function', function () {
    a.noop = {};
    _assert2.default.deepEqual(a.noop, {});
    _assert2.default.equal(a.noop, a.noop);
  });
});
