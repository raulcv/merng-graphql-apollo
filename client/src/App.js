import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import SingleImage from './pages/SingleImage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path='/images/:imageId' component={SingleImage} />
        </Container>
      </Router>
    </AuthProvider>
  );//<div class="ui container"> = <Container>
}

export default App;
