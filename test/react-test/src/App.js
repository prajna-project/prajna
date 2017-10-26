import React, { Component } from 'react';
import KNB from '@dp/knb';
import Prajna from 'prajna';            // 基础功能
import Dejavu from 'prajna-dejavu';        // 场景还原
import PrajnaKNB from '@dp/prajna-knb'; // knb
import logo from './logo.svg';
import './App.css';
const owl = require('@dp/owl');

class App extends Component {
    constructor () {
        super();
        owl.start({
            devMode: true,
            project: window.__appName__,
            pageUrl: 'http://localhost:8088'
        });
        window.LXAnalytics('pageView', null, null, 'example-page');
        let prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        prajna.use(async (ctx, next) => {
	        console.log(ctx);
            next();
        });
        prajna.start();
	    this.prajna = prajna;
    }

    // @window.pageView
    componentDidMount () {
    }

    // @prajnaEvent
    onClickEvent (e) {
	    this.prajna.pageView();
        // // console.log(arguments[0].type);    // click
        // var perfData = window.performance.timing;
        // var pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        // console.log(pageLoadTime);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">React Tests</h1>
                </header>
                <p className="App-intro">
                    Events
                </p>
		        <a className="button" onClick={this.onClickEvent.bind(this)}>click me</a>
            </div>
        );
    }
}

export default App;
