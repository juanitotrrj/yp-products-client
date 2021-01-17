import React, { Component } from "react";
import {
    Route,
    BrowserRouter
} from "react-router-dom";
import ProductList from "../Products/List";
import ProductView from "../Products/View";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={ProductList} />
                    <Route path="/products/:id" component={ProductView} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
