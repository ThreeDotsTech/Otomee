import '@reach/dialog/styles.css'
import Web3ReactManager from 'components/Web3ReactManager';
import React from 'react';
import { Route } from 'react-router-dom'
import styled from 'styled-components/macro';
import Home from "./Home";
import UserProfile from "./UserProfile";
import NavBar from 'components/NavBar'
import Collections from './Collections';
import ItemsPage from './Items';
import Explore from './Explore';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

function App() {
  return (
    <Web3ReactManager>
      <AppWrapper>
        <NavBar />
        <Route exact strict path="/" component={Home} />
        <Route exact strict path="/orbitdb" component={Explore} />
        <Route exact strict path="/profile/:address" component={UserProfile} />
        <Route exact strict path="/collection/:address/:idString" component={ItemsPage} />
        <Route exact strict path="/collection/:address" component={Collections} />

      </AppWrapper>
    </Web3ReactManager>

  );
}

export default App;
