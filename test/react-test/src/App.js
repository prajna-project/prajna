import React, { Component } from 'react';
import Prajna from 'prajna';        // 基础功能
// import Dejavu from 'prajna-dejavu'; // 场景还原
import logo from './logo.svg';
// import KNB from '@dp/knb';
import './App.css';
const owl = require('@dp/owl');

class App extends Component {
    constructor () {
        super();
        owl.start({
            devMode: 'beta',
            project: window.__appName__,
            pageUrl: 'http://localhost:8088'
        });
        let prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        // prajna.use(Dejavu);
        prajna.start();
        // prajna.pageView();
    }

    // @window.pageView
    componentWillMount () {
        // console.log('here');
    }

    // @prajnaEvent
    onClickEvent (e) {
        console.log(arguments[0].type);    // click
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
                <a className="button" onClick={this.onClickEvent}>click me</a>
            </div>
        );
    }
}

export default App;
