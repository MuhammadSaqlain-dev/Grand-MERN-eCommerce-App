import React, { Fragment, useState } from "react";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, logout } from "../../../actions/userAction";

import "./UserOptions.css";

const UserOptions = ({ user }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length >= 1 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logOut },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function orders() {
    history.push("/orders");
  }
  function account() {
    history.push("/account");
  }
  function cart() {
    history.push("/cart");
  }
  function logOut() {
    dispatch(logout());
    alert.success("logout successfully");
  }
  function dashboard() {
    history.push("/admin/dashboard");
  }

  return (
    <Fragment>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial eCommerce Tooltip"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
            className="speedDialIcon"
          />
        }
      >
        {options.map((option) => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
