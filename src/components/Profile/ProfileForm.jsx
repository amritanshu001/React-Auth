import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import useHttp from "../../hooks/useHTTP";
import useInputValidator from "../../hooks/useInputValidator";
import { passwordValidator } from "../../lib/validators";
import webKey from "../../lib/webkey";
import { authActions } from "../../store/auth-slice";
import Message from "../UI/Message";

import classes from "./ProfileForm.module.css";

const URI = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${webKey}`;

const ProfileForm = () => {
  const [newAuthToken, setNewAuthToken] = useState(null);
  const currentToken = useSelector((state) => state.userAuth.authToken);
  const dispatch = useDispatch();
  const redirect = useHistory();

  const passwordResetResponse = useCallback((rawdata) => {
    setNewAuthToken(rawdata.idToken);
  }, []);

  const {
    inputValue: enteredPassword,
    inputIsValid: passwordIsValid,
    isError: passwordError,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    resetInput: passwordReset,
  } = useInputValidator(passwordValidator);

  const {
    isloading: passwordResetLoading,
    error: passwordResetError,
    sendRequest: passwordResetSend,
    resetError: resetSendError,
  } = useHttp(passwordResetResponse);

  const changePasswordHandler = (event) => {
    event.preventDefault();
    const authConfig = {
      url: URI,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        idToken: currentToken,
        password: enteredPassword,
        returnSecureToken: true,
      },
    };
    passwordResetSend(authConfig);
    passwordReset();
  };

  useEffect(() => {
    if (!passwordResetLoading && !passwordResetError && newAuthToken) {
      dispatch(authActions.logUserOut());
      redirect.replace("/auth");
    }
  }, [passwordResetLoading, passwordResetError, newAuthToken]);

  let message;
  if (passwordResetError) {
    message = <Message className="error">{passwordResetError}</Message>;
  }
  if (passwordResetLoading) {
    message = <Message className="laoding">Resetting Password...</Message>;
  }
  if (!passwordResetLoading && !passwordResetError && newAuthToken) {
    message = <Message className="success">Password Succesfully reset</Message>;
  }

  return (
    <form onSubmit={changePasswordHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={enteredPassword}
          onBlur={passwordBlurHandler}
          onChange={passwordChangeHandler}
          className={passwordError ? classes.error : ""}
        />
      </div>
      <div className={classes.action}>
        <button disabled={!passwordIsValid}>Change Password</button>
      </div>
      {message}
    </form>
  );
};

export default ProfileForm;
