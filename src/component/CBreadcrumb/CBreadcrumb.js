import React, {PureComponent} from 'react';
import Proptypes from 'prop-types';
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {withRouter} from 'react-router-dom';

class CBreadcrumb extends PureComponent {
    state = {
        routes: [],
        currentLocation: ""
    };

    setCurrentLocation = (path) => {
        this.setState({currentLocation: path});
    };

    setRoutes = (routes) => {
        this.setState({routes: routes});
    };

    /**
     * GETS ARRAY OF PATH(URL) UPTO CURRENT PAGE
     * @returns {string[]}
     */
    getPathsToInclude = () => {
        let currentLocation = this.state.currentLocation;
        // GET AVAILABLE PATHS IN CURRENT PAGE URL
        let pathsToInclude = ((currentLocation).split('/'));

        // REMOVE THE FIRST EMPTY ELEMENT
        pathsToInclude.shift();

        // IF ROUTE IS NOT 'home' ADD 'home' AS FIRST PATH
        if (pathsToInclude[0] !== "home") {
            pathsToInclude.unshift("home");
        }

        // REMOVE THE END PATHNAME
        pathsToInclude.splice(pathsToInclude.length - 1, 1);

        //INCLUDE '/' IN EACH PATHNAME
        for (let i = 0; i < pathsToInclude.length; i++) {
            pathsToInclude[i] = "/" + pathsToInclude[i];
        }

        //INCLUDE THE FULL PATH TO CURRENT PAGE
        pathsToInclude.push(currentLocation);

        return pathsToInclude;
    };

    /**
     *
     * @param pathsToInclude
     * @returns {Array}
     */
    addRoutesByPathsToInclude = (pathsToInclude) => {
        let routes = [];
        pathsToInclude.forEach(value => {
            routes = routes.concat(this.props.breadcrumbData.filter(data => {
                    if (data.path === value)
                        return data;
                })
            );
        });
        return routes;
    };

    filterRoutesUptoCurrentPage = () => {
        this.setRoutes(this.addRoutesByPathsToInclude(this.getPathsToInclude()));
    };

    setCurrentLocationAndFilterRoutes = async (path) => {
        if (path === undefined) {
            await this.setCurrentLocation(this.props.location.pathname);
        } else {
            await this.setCurrentLocation(path);
        }
        this.filterRoutesUptoCurrentPage();
    };

    componentDidMount() {
        this.setCurrentLocationAndFilterRoutes();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.history) {
            if (prevProps.history.location.pathname !== prevProps.location.pathname) {
                this.setCurrentLocationAndFilterRoutes(prevProps.history.location.pathname)
            } else {
                return false
            }
        } else {
            return false
        }
    }

    checkIfBreadcrumbItemIsLast = (breadcrumb, index) => index !== this.state.routes.length - 1 ?
        {'href': "#" + breadcrumb.path}
        :
        {'active': true};

    getBreadcrumbItemProps = (breadcrumb, index) => ({
        'key': "breadcrumb" + index,
        'test-id': "breadcrumbItem" + breadcrumb.id,
        'as': this.props.itemAs,
        'title': this.props.title,
        'target': this.props.target,
        'bsPrefix': this.props.itemBsPrefix,
        'children': this.props.itemChildren,
        ...this.checkIfBreadcrumbItemIsLast(breadcrumb, index)
    });

    getBreadcrumbItems = (breadcrumb, index) =>
        <Breadcrumb.Item
            {...this.getBreadcrumbItemProps(breadcrumb, index)}
        >
            {breadcrumb.name}
        </Breadcrumb.Item>;

    render() {
        return (
            <Breadcrumb
                as={this.props.as}
                label={this.props.label}
                listProps={this.props.listProps}
                bsPrefix={this.props.bsPrefix}
                children={this.props.children}
            >
                {this.state.routes.map((breadcrumb, index) => (
                    this.getBreadcrumbItems(breadcrumb, index)
                ))}
            </Breadcrumb>);
    }
}

React.propTypes = {
    breadcrumbData: Proptypes.array.isRequired,
    as: Proptypes.elementType,
    label: Proptypes.string,
    bsPrefix: Proptypes.string,
    listProps: Proptypes.object,
    children: Proptypes.array,
    title: Proptypes.node,
    target: Proptypes.string,
    href: Proptypes.string,
    active: Proptypes.boolean,
    itemAs: Proptypes.elementType,
    itemBsPrefix: Proptypes.string,
    itemChildren: Proptypes.array
};

export default withRouter(CBreadcrumb);