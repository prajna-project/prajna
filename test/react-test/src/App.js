import React, { Component } from 'react';
import Prajna from 'prajna';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
    constructor () {
        super();
        this.prajna = Prajna.init({
            pageId: 'prajna-test',
            channel: 'web',
            ignore: {
                ajax: [/prajna.(51ping|dianping|local).com/]
            }
        });
        this.prajna.start();
    }

    componentWillMount () {}

    onClickEvent (e) {
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
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">React Tests</h1>
                </header>
                <p className="App-intro">Events</p>
                <a className="button" onClick={this.onClickEvent.bind(this)}>click me</a>
            </div>
        );
    }
}

export default App;
