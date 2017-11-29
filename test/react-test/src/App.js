import React, { Component } from 'react';
import KNB from '@dp/knb';
import Prajna from 'prajna';            // 基础功能
import Dejavu from 'prajna-dejavu';        // 场景还原
import prajnaKnb from '@dp/prajna-knb';        // 场景还原
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

const owl = require('@dp/owl');

class App extends Component {
    constructor () {
        super();
        // owl.start({
        //     devMode: true,
        //     project: window.__appName__,
        //     pageUrl: 'http://localhost:8088'
        // });
        // window.LXAnalytics('pageView', null, null, 'example-page');

        this.prajna = Prajna.init({
            pageId: 'order-dish-lancelot-test',
            channel: 'web',
            ignore: {
                // resource: [],
                ajax: [/prajna.(51ping|dianping|local).com/]
            }
        });
        this.prajna.use(KNB);




        this.prajna.use(Dejavu);
        // this.prajna.use(async function (ctx, next) {
        //     next();
        // });
        this.prajna.start();
    }

    componentWillMount () {
        let ctx = this;
        ctx.setState({ 'r': true });
    }

    onClickEvent (e) {
        //console.log('combo');
        // this.orderid = 'xxx';
        // owl.addError('error msg', {level: 'debug', combo: true});

        // axios.get('/fewaf/fe').then(function () {
        // }).catch(function (error) {
        // });

        this.prajna.report({
            level: 'WARNING',
            name: 'sample-error',
            padding: {
                'key-first': 'padding info',
                'key-second': 'padding info'
                // ...
            },
            content: 'Reporting a prajna log message'
        });
        // this.prajna.moduleView('viewHere', {
        //     'padding-info': true
        // });
        // this.prajna.moduleEdit('editHere', {
        //     'padding-info': true
        // });
        // const a = {};
        // a.b.forEach((item) => {
        //     console.log(item);
        // });
    }

    render() {
        return (
            <div className="App">
                {this.state.r ? (
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <img src="//yyy.jpg" className="fuck" alt="logos" />
                        <h1 className="App-title">React Tests</h1>
                    </header>
                ) : null}
                <p className="App-intro">Events</p>
                <a className="button" onClick={this.onClickEvent.bind(this)}>click me</a>
            </div>
        );
    }
}

export default App;
