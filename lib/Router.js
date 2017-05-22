'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _routeParser = require('route-parser');

var _routeParser2 = _interopRequireDefault(_routeParser);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Router = (_temp2 = _class = function (_Component) {
    _inherits(Router, _Component);

    function Router() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Router);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Router.__proto__ || Object.getPrototypeOf(Router)).call.apply(_ref, [this].concat(args))), _this), _this._unlisten = null, _this.state = {
            location: undefined,
            route: {}
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Router, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._unlisten();
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.createRoutes();

            var _props = this.props,
                history = _props.history,
                historyCallback = _props.historyCallback;


            var currentLocation = history.location;

            var url = this.urlFromLocation(currentLocation);
            this.setState({
                location: currentLocation,
                route: this.parseUrl(url)
            }, function () {
                if (historyCallback) {
                    historyCallback(url);
                }
            });

            this._unlisten = history.listen(function (location) {

                var url = _this2.urlFromLocation(location);

                _this2.setState({
                    location: location,
                    route: _this2.parseUrl(url)
                }, function () {
                    if (historyCallback) {
                        historyCallback(url);
                    }
                });
            });
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                router: {
                    to: this.transitionTo.bind(this),
                    transitionTo: this.transitionTo.bind(this),
                    reverse: _utils.reverse.bind(this),
                    navigate: this.navigate.bind(this)
                }
            };
        }
    }, {
        key: 'transitionTo',
        value: function transitionTo(to) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.navigate((0, _utils.reverse)(to, params, query));
        }
    }, {
        key: 'navigate',
        value: function navigate(url) {
            this.props.history.push(url);
        }
    }, {
        key: 'createRoutes',
        value: function createRoutes() {
            var routes = this.props.routes;

            for (var name in routes) {
                var _routes$name = routes[name],
                    path = _routes$name.path,
                    component = _routes$name.component,
                    wrapper = _routes$name.wrapper;

                _store2.default.set(name, {
                    route: new _routeParser2.default(path),
                    component: component,
                    wrapper: wrapper
                });
            }
        }
    }, {
        key: 'urlFromLocation',
        value: function urlFromLocation(location) {
            return (0, _urljoin2.default)(location.pathname, location.search);
        }
    }, {
        key: 'parseUrl',
        value: function parseUrl(url) {
            var routes = _store2.default.all();

            for (var name in routes) {
                var _routes$name2 = routes[name],
                    route = _routes$name2.route,
                    component = _routes$name2.component,
                    wrapper = _routes$name2.wrapper,
                    params = route.match(url);


                if (params) {
                    return { params: params, component: component, wrapper: wrapper };
                }
            }

            return null;
        }
    }, {
        key: 'render',
        value: function render() {
            var fallback = this.props.fallback;
            var _state = this.state,
                route = _state.route,
                location = _state.location;


            var query = _queryString2.default.parse(location.search.substring(1)),
                props = { params: {}, query: query };

            if (route) {
                props = _extends({}, props, { params: route.params });

                return createElement(route.wrapper ? route.wrapper : route.component, props, route.wrapper ? createElement(route.component, props) : null);
            } else if (fallback) {
                return fallback(props);
            } else {
                return _react2.default.createElement(
                    'div',
                    null,
                    'Unknown route'
                );
            }
        }
    }]);

    return Router;
}(_react.Component), _class.propTypes = {
    history: _propTypes2.default.object.isRequired,
    routes: _propTypes2.default.object.isRequired,
    historyCallback: _propTypes2.default.func,
    fallback: _propTypes2.default.func
}, _class.childContextTypes = {
    router: _propTypes2.default.object
}, _temp2);
exports.default = Router;