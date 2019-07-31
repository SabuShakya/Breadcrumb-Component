import React, {PureComponent} from 'react';
import Proptypes from 'prop-types';
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {withRouter} from 'react-router-dom';

class CBreadcrumb extends PureComponent {
    state = {
        routes: [],
        currentLocation: ""
    };

    setCurrentLocation = path => {
        this.setState({currentLocation: path});
    };

    setRoutes = routes => {
        this.setState({routes: routes});
    };

    /**
     * GETS ARRAY OF PATH(URL) UPTO CURRENT PAGE
     * @returns {string[]}
     */
    getPathsToInclude = () => {
        let currentLocation = this.state.currentLocation !== "" ?
            this.state.currentLocation : this.props.location.pathname;
        // GET AVAILABLE PATHS IN CURRENT PAGE URL
        let pathsToInclude = ((currentLocation).split('/'));

        // REMOVE THE FIRST EMPTY ELEMENT FROM ARRAY
        pathsToInclude.shift();

        // IF ROUTE IS NOT 'home' ADD 'home' AS FIRST PATH
        pathsToInclude[0] !== "home" && pathsToInclude.unshift("home");

        // REMOVE THE END PATHNAME
        pathsToInclude.splice(pathsToInclude.length - 1, 1);

        //INCLUDE '/' IN EACH PATHNAME
        for (let i = 0; i < pathsToInclude.length; i++) {
            pathsToInclude[i] = "/" + pathsToInclude[i];
        }

        //FINALLY INCLUDE THE FULL PATH TO CURRENT PAGE
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
            routes = routes.concat(this.props.breadcrumbData.filter(data =>
                data.path === value
            ));
        });
        return routes;
    };

    filterAndSetRoutesUptoCurrentPage = () => {
        this.setRoutes(this.addRoutesByPathsToInclude(this.getPathsToInclude()));
    };

    setCurrentLocationAndFilterRoutes = async (path) => {
        path === undefined ? await this.setCurrentLocation(this.props.location.pathname)
            : await this.setCurrentLocation(path);
        this.filterAndSetRoutesUptoCurrentPage();
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

    getBreadcrumbItemProps = (breadcrumb, index) => {
        const {itemAs, title, target, itemBsPrefix, itemChildren} = this.props;
        return ({
            'key': "breadcrumb" + breadcrumb.id,
            'test-id': "breadcrumbItem" + breadcrumb.id,
            'as': itemAs,
            'title': title,
            'target': target,
            'bsPrefix': itemBsPrefix,
            'children': itemChildren,
            ...this.checkIfBreadcrumbItemIsLast(breadcrumb, index)
        });
    };

    getBreadcrumbItems = (breadcrumb, index) =>
        <Breadcrumb.Item
            {...this.getBreadcrumbItemProps(breadcrumb, index)}
        >
            {breadcrumb.name}
        </Breadcrumb.Item>;

    render() {
        const {as, label, listProps, bsPrefix, children} = this.props;
        return (
            <Breadcrumb
                as={as}
                label={label}
                listProps={listProps}
                bsPrefix={bsPrefix}
                children={children}
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

/**
 * 'withRouter' IS A HIGHER ORDER COMPONENT PROVIDED BY 'react-router-dom'.
 * 'withRouter' WILL PASS UPDATED 'match', 'location', and 'history' PROPS
 * TO THE WRAPPED COMPONENT WHENEVER IT RENDERS.
 * IN BREADCRUMB COMPONENT IT IS USED TO DETECT THE ROUTE CHANGE ALONG WITH 'componentDidUpdate' LIFECYCLE METHOD.
 */
export default withRouter(CBreadcrumb);