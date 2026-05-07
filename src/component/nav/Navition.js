import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Logout } from "../services/userservice";

const NAV = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      let res = await Logout();
      if (res) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {}
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="white" className="shadow-sm py-3 custom-nav">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4">
          YU-H8129
        </Navbar.Brand>

        <Nav className="ms-auto gap-2 align-items-center">
          <Nav.Link as={NavLink} to="/users">
            Users
          </Nav.Link>
          <Nav.Link as={NavLink} to="/project">
            Project
          </Nav.Link>
          <Nav.Link as={NavLink} to="/roles">
            Roles
          </Nav.Link>
          <Nav.Link as={NavLink} to="/group-role">
            Group-Role
          </Nav.Link>
          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary"></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                {user ? (
                  <span onClick={() => handleLogout()}>Logout</span>
                ) : (
                  <span onClick={() => handleLogin()}>Login</span>
                )}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NAV;
