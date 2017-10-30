import React, { Component } from 'react';
import KNB from '@dp/knb';
import Prajna from 'prajna';            // 基础功能
import Dejavu from 'prajna-dejavu';        // 场景还原
import PrajnaKNB from '@dp/prajna-knb'; // knb
import logo from './logo.svg';
import axios from 'axios';
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
        this.prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        this.prajna.use(Dejavu);
        this.prajna.use(async (ctx, next) => {
            // console.log(ctx);
            next();
        });
        this.prajna.start();
        // window.onerror = function (msg, url, line) {
        //     console.log(arguments);
        // };
    }

    componentDidMount () {
        // axios.get('fewawg/feawfew', {
        // }).then((response) => {
        //     console.log(response);
        // }, (error) => {
        //     console.log(error);
        // });
    }

    // @prajnaEvent
    onClickEvent (e) {
        this.prajna.report();
        // owl.addError({
        //     name: 'whereAmI-type-weixin',
        //     msg: '失败的原因有很多'
        // });

        // const ee = new Error('test error');
        // throw ee;

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
