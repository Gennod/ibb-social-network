import React from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loginWithGoogle, logout } from "../store/features/authSlice";
import Button from "react-bootstrap/Button";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

export default function AuthButton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);

  return (
    <header className="header">
      {user ? (
        <div className="header__content">
          <p className="header__text">Welcome, {user.displayName}</p>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="transparet" id="dropdown-custom-1">
              <img
                className="header__img"
                src={user.photoURL || undefined}
              ></img>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                disabled={status === "loading"}
                onClick={() => dispatch(logout())}
                eventKey="1"
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <div className="header__content">
          <p className="header__text">
            {status === "loading" ? "Loading..." : "Please, SignIn"}
          </p>
          <Button
            disabled={status === "loading"}
            onClick={() => dispatch(loginWithGoogle())}
            variant="primary"
          >
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
