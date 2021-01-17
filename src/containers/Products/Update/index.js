import React, { Component } from "react";
import {
    Form,
    Button,
    Modal,
    InputGroup,
} from 'react-bootstrap';

class ProductUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            show: props.show,
            closeCallback: props.closeCallback,
            productName: "",
            urlSegment: 0,
            sku: 0.00,
            price: 0
        };
        this.updateProduct = this.updateProduct.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    async updateProduct(event) {
        event.preventDefault();
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products/${this.state.id}`;

        await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                name: this.state.productName,
                url_segment: this.state.urlSegment,
                sku: parseInt(this.state.sku, 10),
                price: parseFloat(this.state.price),
            })
        })
            .then(response => response.json())
            .then(() => {
                this.state.closeCallback();
                this.setState({ show: false });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    async getProduct(callback = null) {
        console.log(this.state);
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products/${this.state.id}`;
        const response = await fetch(url);
        const data = await response.json();
        this.setState({
            id: data.data.id,
            productName: data.data.name,
            urlSegment: data.data.url_segment,
            sku: data.data.sku,
            price: data.data.price
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    handleFormChange(event, convertPercent = false) {
        this.setState({ [event.target.id]: convertPercent ? event.target.value / 100 : event.target.value });
    }

    render() {
        return (
            <Modal
                show={this.state.show}
                onHide={() => this.setState({ show: false })}
                backdrop="static"
                keyboard={false}
            >
                <Form
                    onSubmit={this.updateProduct}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name of this Product" onChange={this.handleFormChange} defaultValue={this.state.productName} />
                        </Form.Group>

                        <Form.Group controlId="urlSegment">
                            <Form.Label>URL Segment</Form.Label>
                            <Form.Control type="text" placeholder="URL Segment" onChange={this.handleFormChange} defaultValue={this.state.urlSegment} />
                        </Form.Group>

                        <Form.Group controlId="sku">
                            <Form.Label>Product SKU</Form.Label>
                            <Form.Control type="text" placeholder="Product SKU" onChange={this.handleFormChange} defaultValue={this.state.sku} />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Price" onChange={this.handleFormChange} defaultValue={this.state.price} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => this.setState({ show: false })}>Cancel</Button>
                        <Button type="submit" variant="warning">Re-generate</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

export default ProductUpdate;
