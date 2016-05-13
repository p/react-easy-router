import React, { Component, PropTypes } from 'react';
import Route from 'route-parser';
import Qs from 'query-string';
import urlJoin from 'url-join';
import store from './store';
import { reverse } from './utils';

export default class Router extends Component {
    _unlisten = null;

    static propTypes = {
        history: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
        notFound: PropTypes.func,
        historyCallback: PropTypes.func
    };

    static defaultProps = {
        notFound: null
    };

    state = {
        route: {
            component: null,
            wrapper: null,
            params: {}
        }
    };

    static childContextTypes = {
        router: PropTypes.object
    };

    getChildContext() {
        return {
            router: {
                to: this.transitionTo.bind(this),
                transitionTo: this.transitionTo.bind(this),
                reverse: reverse.bind(this),
                navigate: this.navigate.bind(this)
            }
        };
    }

    transitionTo(to, params = {}, query = {}) {
        this.navigate(reverse(to, params, query));
    }

    navigate(url) {
        this.props.history.push(null, url);
    }

    createRoutes() {
        const { routes } = this.props;
        for (let name in routes) {
            let { path, component, wrapper } = routes[name];
            store.set(name, {route: new Route(path), component, wrapper});
        }
    }

    urlFromLocation(location) {
        if (location.search.length > 0) {
            return urlJoin('/', location.pathname, location.search);
        } else {
            return urlJoin('/', location.pathname);
        }
    }

    parseUrl(url) {
        let routes = store.all();
        for (let name in routes) {
            let { route, component, wrapper } = routes[name];

            let params = route.match(url);
            if (params) {
                return {
                    params,
                    component,
                    wrapper
                };
            }
        }

        if (this.props.notFound) {
            return {
                params: {},
                component: this.props.notFound,
                wrapper: null
            };
        } else {
            throw new Error('Unknown route');
        }
    }

    componentWillUnmount() {
        this._unlisten();
    }

    componentWillMount() {
        this.createRoutes();

        const { history } = this.props;
        this._unlisten = history.listen(location => {
            if (this.props.historyCallback) {
                this.props.historyCallback();
            }
            this.setState({
                location,
                route: this.parseUrl(this.urlFromLocation(location))
            });
        });
    }

    render() {
        const { route, location } = this.state;
        let query = Qs.parse(location.search.substring(1));
        let newLocation = {
            ...location,
            query: query
        };
        let props = {
            params: route.params,
            query: query,
            location: newLocation
        };

        if (route.wrapper) {
            let children = React.createElement(route.component, props);
            return React.createElement(route.wrapper, props, children);
        } else {
            return React.createElement(route.component, props);
        }
    }
}