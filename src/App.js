import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Register from './Components/register';
import Profile from './Components/profile';
import NotFound from './Components/notFound';
import NotUser from './Components/notUser';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Success from './Components/success';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <h2>Accounts</h2>
        <ul>
          <li>
            <Link to="/register/U8b094a0295acbe8268eadcb3f95d2729">Register</Link>
          </li>
          <li>
            <Link to="/profile/U8b094a0295acbe8268eadcb3f95d2729">Profile</Link>
          </li>
          <li>
            <Link to="/notfound">Not Found Page</Link>
          </li>
          <li>
            <Link to="/notuser">Not Found Page</Link>
          </li>
          <li>
            <Link to="/success">SUCCESS</Link>
          </li>
        </ul> */}
        
        <Switch>
          <Route path="/register/:id" render={(props) => (
            <Register {...props}/>
          )}
          />
          <Route path="/profile/:id" render={(props) => (
            <Profile {...props}/>
          )}
          />
          <Route path="/notuser" render={(props) => (
            <NotUser />
          )}
          />
          <Route path="/notfound" render={(props) => (
            <NotFound />
          )}
          />
          <Route path="/success" render={(props) => (
            <Success />
          )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
