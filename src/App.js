import React from 'react';
import './App.css';
import CBreadcrumb from "./component/CBreadcrumb/CBreadcrumb";
import {HashRouter, Switch, Route} from 'react-router-dom';

function App() {
    const dataForBreadCrumb = [
        {
            id: '1',
            name: 'Home',
            path: '/home'
        },
        {
            id: '2',
            name: 'General Setup',
            path: '/home/generalSetup'
        }];
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/'/>
                <Route path='/generalSetup' exact/>
            </Switch>
            <CBreadcrumb breadcrumbData={dataForBreadCrumb}></CBreadcrumb>
        </HashRouter>
    );
}

export default App;
