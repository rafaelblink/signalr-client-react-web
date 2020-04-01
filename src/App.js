import React from 'react';
import './App.css';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { URLAPI } from './conf';
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Badge,
  Table,
  Container,
  Row
} from 'react-bootstrap';
import swal from '@sweetalert/with-react';

class App extends React.Component {
  // Builds the SignalR connection, mapping it to /chat
  _hubConnection = new HubConnectionBuilder()
    .withUrl(URLAPI)
    .withAutomaticReconnect()
    .build();

  constructor() {
    super();
    this.state = {
      orders: []
    };
  }
  componentDidMount() {
    this._hubConnection.start().then(a => {
      console.log('Connected');
    });
    this._hubConnection.on('ReceiveOrder', order => {
      let ordersState = this.state.orders;
      ordersState.push(order);

      this.setState({ orders: ordersState });
      swal("New order!", "You've received an order.", "success");
    });
    this._hubConnection.onreconnecting(error => {
      console.assert(
        this._hubConnection.state === HubConnectionState.Reconnecting
      );
    });
  }
  render() {
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">React SignalR</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                Orders { this.state.orders.length !== 0 ? <Badge variant="info">{this.state.orders.length}</Badge> : null }
              </Nav.Link>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container style={{ marginTop: '40px' }}>
          <Row>
            <h1 className="display-4">Orders</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Table #</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Extras</th>
                </tr>
              </thead>
              <tbody>
                { this.state.orders.map(order => {
                   return (
                   <tr key={order.id}>
                   <td>{order.id}</td>
                   <td style={{ textAlign: "center" }}>
                     <h5><Badge variant="info">
                      {order.tableNumber}
                     </Badge>
                     </h5>                     
                   </td>
                   <td>{order.customer}</td>
                   <td>{order.item}</td>
                   <td>{order.extras}</td>
                 </tr>
                 )
                })}           
              </tbody>
            </Table>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
