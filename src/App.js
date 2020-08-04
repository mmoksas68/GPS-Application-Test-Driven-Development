import React from 'react';
import MyMap from "./views/Map";
import './App.css';

class App extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App container">
                <MyMap></MyMap>
            </div>
        );
    }


}

export default App;
