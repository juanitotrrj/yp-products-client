import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
} from 'react-bootstrap';
import moment from 'moment';

class ProductView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            product: {}
        };
    }

    async componentDidMount() {
        await this.getProduct();
    }

    async getProduct() {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products/url_segment/${this.state.id}`;
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ product: data.data });
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <center>
                                <h1>{this.state.product.name}</h1>
                            </center>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <center>
                                <Button variant="primary" as={NavLink} to="/">&larr; Back to Main</Button>
                            </center>
                            <br />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 12 }}>
                            <Table bordered hover>
                                <tbody>
                                    <tr>
                                        <th>Product Name</th>
                                        <td>{this.state.product.name}</td>
                                    </tr>
                                    <tr>
                                        <th>URL Segment</th>
                                        <td>{this.state.product.url_segment}</td>
                                    </tr>
                                    <tr>
                                        <th>SKU</th>
                                        <td>{this.state.product.sku}</td>
                                    </tr>
                                    <tr>
                                        <th>Price</th>
                                        <td>{`${new Intl.NumberFormat().format(this.state.product.price)}`}</td>
                                    </tr>
                                    <tr>
                                        <th>Date Created</th>
                                        <td>{moment(this.state.product.created_at).format('MM/DD/YYYY HH:mm')}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProductView;
