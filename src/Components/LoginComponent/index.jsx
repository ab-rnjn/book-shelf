import React, { useState } from "react";
import { Grid, Form, Header, Message } from 'semantic-ui-react';
import styles from './styles.css';
import { useHistory } from 'react-router-dom';
import { loginService, signUpService, usernameService } from "./service";

export default function Login() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!newUsername || !newPassword) {
      return setSignupError("Invalid Username or Password");
    }
    await signUpService({
      username: newUsername, password: newPassword,
      first_name: firstname, last_name: lastname
    }).catch(e => { setSignupError(e) });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return setLoginError("Invalid Username or Password");
    }
    try {
      await loginService({ username, password });
      history.push('/home');
    } catch (e) {
      setLoginError(e);
    }
  }

  const verifyUsername = async (e) => {
    e.preventDefault();
    await usernameService({ username: newUsername }).catch(e => {
      setNewUsername("");
      setSignupError("Username Taken");
    })
  }
  return (
    <Grid>
      <Grid.Column width={8}>
        <Form className={"login-form"} error={loginError} onSubmit={handleLogin}>
          <Header as="h1">Login</Header>
          {loginError && <Message
            error={loginError}
            content={loginError}
          />}
          <Form.Input
            inline
            label="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Input
            inline
            label="Password"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Button type="submit">Go!</Form.Button>
        </Form>
      </Grid.Column>

      <Grid.Column width={6}>
        <Form className={"login-form"} error={signupError} onSubmit={handleSignup}>
          <Header as="h1">SignUp</Header>
          {signupError && <Message
            error={signupError}
            content={signupError}
          />}
          <Form.Input
            inline
            label="First Name"
            name="firstname"
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Form.Input
            inline
            label="Last Name"
            name="lastname"
            onChange={(e) => setLastname(e.target.value)}
          />
          <Form.Input
            inline
            label="Username"
            name="newusername"
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Form.Button onClick={verifyUsername}>Check Username</Form.Button>
          <Form.Input
            inline
            label="Password"
            type="password"
            name="newpassword"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Form.Button type="submit">Go!</Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
}