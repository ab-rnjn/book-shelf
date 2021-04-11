import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Inventory from './Components/InventoryComponent';
import Login from './Components/LoginComponent';

function App() {
  return (
    <div className="app-routes">
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" exact component={Inventory} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
