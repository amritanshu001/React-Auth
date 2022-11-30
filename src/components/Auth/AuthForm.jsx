import { useState, useCallback, useEffect } from "react";
import useInputValidator from "../../hooks/useInputValidator";
import { emailValidator, passwordValidator } from "../../lib/validators";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import webKey from "../../lib/webkey";
import useHttp from "../../hooks/useHTTP";
import Message from "../UI/Message";
import { authActions } from "../../store/auth-slice";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [localId, setLocalId] = useState(null);
  const [authId, setAuthId] = useState(null);

  const dispatch = useDispatch();
  const redirect = useHistory();

  const signUpResponse = useCallback((rawData) => {
    setLocalId(rawData.localId);
    setAuthId(rawData.idToken);
  }, []);

  const {
    inputValue: enteredEmail,
    inputIsValid: emailIsValid,
    isError: emailError,
    inputBlurHandler: emailBlurHandler,
    inputChangeHandler: emailChangeHandler,
    resetInput: emailReset,
  } = useInputValidator(emailValidator);

  const {
    inputValue: enteredPassword,
    inputIsValid: passwordIsValid,
    isError: passwordError,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    resetInput: passwordReset,
  } = useInputValidator(passwordValidator);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const {
    isloading: signUpLoading,
    error: signUpError,
    sendRequest: sendSignUpRequest,
    resetError: signupErrorReset,
  } = useHttp(signUpResponse);

  let formIsValid = passwordIsValid && emailIsValid;

  const formSubmitHandler = (event) => {
    event.preventDefault();
    let url;
    if (!isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${webKey}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${webKey}`;
    }
    const authConfig = {
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      },
    };

    sendSignUpRequest(authConfig);
    emailReset();
    passwordReset();
  };

  let message;

  if (signUpError) {
    message = <Message className="error">{signUpError}</Message>;
  }
  if (!signUpError && signUpLoading) {
    if (!isLogin) {
      message = (
        <Message className="loading">Setting Up your credentials...</Message>
      );
    } else {
      message = <Message className="loading">Logging In...</Message>;
    }
  }
  if (!signUpError && !signUpLoading && localId) {
    if (!isLogin) {
      message = (
        <Message className="success">{`Done! Id ${localId} created`}</Message>
      );
    } else {
      dispatch(authActions.logUserIn({ authToken: authId }));
      message = <Message className="success">Logged In!</Message>;

      // <Redirect to="/profile" />;
    }
  }

  useEffect(() => {
    const setTimer = setTimeout(() => {
      if (localId) {
        setLocalId(null);
        redirect.replace("/");
      }
    }, 5000);
    return () => {
      clearTimeout(setTimer);
    };
  }, [localId]);

  useEffect(() => {
    const setTimer = setTimeout(() => {
      if (signUpError) {
        signupErrorReset();
      }
    }, 5000);
    return () => {
      clearTimeout(setTimer);
    };
  }, [signUpError, message]);

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            value={enteredEmail}
            type="email"
            id="email"
            onBlur={emailBlurHandler}
            onChange={emailChangeHandler}
            required={true}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onBlur={passwordBlurHandler}
            onChange={passwordChangeHandler}
            required
          />
        </div>
        <div className={classes.actions}>
          {!signUpLoading && (
            <button disabled={!formIsValid}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
      {message}
    </section>
  );
};

export default AuthForm;
