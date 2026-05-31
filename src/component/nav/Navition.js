import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";

import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";

import { toggleTheme } from "../redux/slices/themeSlice";

import { Logout } from "../services/userservice";

import "./nav.scss";

const NAV = () => {
  const user = useSelector((state) => state.auth.user);

  const mode = useSelector((state) => state.theme.mode);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let res = await Logout();

      if (res) {
        localStorage.removeItem("access_token");

        dispatch(logout());

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      bg={mode}
      variant={mode}
      className="custom-nav sticky-top"
    >
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={NavLink} to="/" className="logo">
          🚀 TaskFlow
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          {/* CENTER NAV */}
          <Nav className="mx-auto gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/project"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="/roles"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Roles
            </NavLink>

            <NavLink
              to="/group-role"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Group Role
            </NavLink>
          </Nav>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3">
            {/* THEME */}
            <button
              className="btn btn-outline-secondary rounded-pill px-3"
              onClick={() => dispatch(toggleTheme())}
            >
              {mode === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            {/* USER */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant={mode === "light" ? "light" : "dark"}
                className="rounded-pill px-3 border"
              >
                {user ? `👋 ${user.username}` : "Account"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {user ? (
                  <>
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      Profile
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item onClick={handleLogin}>Login</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NAV;
