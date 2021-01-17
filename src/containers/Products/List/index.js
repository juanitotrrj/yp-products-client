import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    InputGroup,
    FormControl,
    Form,
    DropdownButton,
    Dropdown,
} from 'react-bootstrap';
import moment from 'moment';
import { parseQueryStringToJson } from "../../../helpers";
import ProductCreate from "../Create";
import ProductUpdate from "../Update";

class ProductList extends Component {
    constructor(props) {
        super(props);
        const queryString = parseQueryStringToJson(props.location.search);
        this.state = {
            productIdToEdit: 0,
            page: queryString.page || 1,
            perPage: queryString.per_page || 10,
            products: {
                data: [],
            },
        };
        this.searchProducts = this.searchProducts.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.handlePaginatePrev = this.handlePaginatePrev.bind(this);
        this.handlePaginateNext = this.handlePaginateNext.bind(this);
    }

    handlePerPage(value, search = true) {
        this.setState({ perPage: value }, () => {
            if (search) {
                this.searchProducts();
            }
        });
    }

    handlePage(event) {
        this.setState({ page: parseInt(event.target.value, 10) });
    }

    handlePaginatePrev(event) {
        if (this.state.page > 1) {
            this.setState({ page: parseInt(this.state.page, 10) - 1 }, () => { this.searchProducts(); });
        }
    }

    handlePaginateNext(event) {
        const nextPage = parseInt(this.state.page, 10) + 1;
        if (nextPage <= this.state.products.last_page) {
            this.setState({ page: nextPage }, () => { this.searchProducts(); });
        }
    }

    handlePaginate(event) {
        this.searchProducts();
        event.preventDefault();
    }

    handleShowUpdateModal(productId) {
        this.updateChild.setState({ id: productId }, () => {
            this.updateChild.getProduct(() => this.updateChild.setState({ show: true }));
        });
    }

    async handleDeleteProduct(productId) {
        await this.deleteProduct(productId);
    }

    async deleteProduct(productId) {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products/${productId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
            .then(() => this.searchProducts())
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    async componentDidMount() {
        await this.searchProducts();
    }

    async searchProducts() {
        const paginationQuery = `page=${this.state.page}&per_page=${this.state.perPage}`;
        const url = `${process.env.REACT_APP_PRODUCTS_API_URI}/api/v1/products?${paginationQuery}`;
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ products: data });
    }

    render() {
        return (
            <div>
                <ProductUpdate
                    ref={ref => (this.updateChild = ref)}
                    show={false}
                    closeCallback={this.searchProducts}
                />
                <ProductCreate
                    ref={ref => (this.createChild = ref)}
                    show={false}
                    closeCallback={this.searchProducts}
                />
                <Container>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <center>
                                <h1>Products</h1>
                            </center>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <center>
                                <Button variant="primary" onClick={() => this.createChild.setState({ show: true })}>Create Product</Button>
                            </center>
                            <br />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 12 }}>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>URL Segment</th>
                                        <th>SKU</th>
                                        <th>Price</th>
                                        <th>Date Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.products.data.map((product) => {
                                            return <tr>
                                                <td>{product.name}</td>
                                                <td>{product.url_segment}</td>
                                                <td>{product.sku}</td>
                                                <td>{product.price}</td>
                                                <td>{moment(product.created_at).format('MM/DD/YYYY HH:mm')}</td>
                                                <td>
                                                    <Button size="sm" variant="primary" as={NavLink} to={`products/${product.id}`}>View</Button>
                                                    <Button size="sm" variant="warning" onClick={() => this.handleShowUpdateModal(product.id)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => this.handleDeleteProduct(product.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 3, offset: 1 }}>
                            <Form onSubmit={(e) => { this.handlePaginate(e); }}>
                                <InputGroup className="mb-3">
                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        variant="outline-primary"
                                        title="Rows"
                                        id="input-group-dropdown-1"
                                    >
                                        <Dropdown.Item onClick={() => { this.handlePerPage(5); }}>5 rows</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.handlePerPage(10); }}>10 rows</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.handlePerPage(50); }}>50 rows</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.handlePerPage(100); }}>100 rows</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.handlePerPage(200); }}>200 rows</Dropdown.Item>
                                    </DropdownButton>
                                    <FormControl
                                        placeholder="Rows per page"
                                        aria-label="Rows per page"
                                        aria-describedby="basic-addon1"
                                        defaultValue={this.state.perPage}
                                        onChange={(e) => { this.handlePerPage(parseInt(e.target.value, 10), false); }}
                                        value={this.state.perPage}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                        <Col md={{ span: 3, offset: 4 }}>
                            <Form onSubmit={(e) => { this.handlePaginate(e); }}>
                                <InputGroup>
                                    <FormControl
                                        placeholder="Page"
                                        aria-label="Page"
                                        aria-describedby="basic-addon2"
                                        defaultValue={this.state.page}
                                        onChange={this.handlePage}
                                        value={this.state.page}
                                    />
                                    <InputGroup.Append>
                                        <Button onClick={this.handlePaginatePrev} variant="outline-primary">Prev</Button>
                                        <Button onClick={this.handlePaginateNext} variant="outline-primary">Next</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProductList;
