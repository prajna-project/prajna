import React, { Component } from 'react';
import Prajna from 'prajna';        // 基础功能
import Dejavu from 'prajna-dejavu'; // 场景还原
import logo from './logo.svg';
import './App.css';

class App extends Component {
    componentWillMount () {
        let prajna = Prajna.init({
            autopv: false
        });
        prajna.use(Dejavu);
        prajna.start();
        prajna.report({});
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
