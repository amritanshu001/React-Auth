import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const userLoggedIn = useSelector((state) => state.userAuth.userLoggedIn);
  const dispatch = useDispatch();
  const redirect = useHistory();

  const logoutHandler = () => {
    dispatch(authActions.logUserOut());
    redirect.replace("/auth");
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!userLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {userLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {userLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
