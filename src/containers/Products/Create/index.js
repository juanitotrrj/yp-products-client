import React, { Component } from "react";
import {
    Form,
    Button,
    Modal,
} from 'react-bootstrap';

class ProductCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            closeCallback: props.closeCallback,
            productName: "",
            urlSegment: 0,
            sku: 0.00,
            price: 0
        };
        this.createProduct = this.createProduct.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    async createProduct(event) {
        event.preventDefault();
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products`;

        await fetch(url, {
            method: 'POST',
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

    handleFormChange(event) {
        this.setState({ [event.target.id]: event.target.value });
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
                    onSubmit={this.createProduct}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name of this Product" onChange={this.handleFormChange} />
                        </Form.Group>

                        <Form.Group controlId="urlSegment">
                            <Form.Label>URL Segment</Form.Label>
                            <Form.Control type="text" placeholder="URL Segment" onChange={this.handleFormChange} />
                        </Form.Group>

                        <Form.Group controlId="sku">
                            <Form.Label>Product SKU</Form.Label>
                            <Form.Control type="text" placeholder="Product SKU" onChange={this.handleFormChange} />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Price" onChange={this.handleFormChange} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => this.setState({ show: false })}>Cancel</Button>
                        <Button type="submit" variant="success">Generate</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

export default ProductCreate;
