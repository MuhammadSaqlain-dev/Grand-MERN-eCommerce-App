import React, { useEffect, useState } from "react";
import webFont from "webfontloader";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import Payment from "./component/Cart/Payment.js";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeSecretKey);
  }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    getStripeApiKey();

    store.dispatch(loadUser());
  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={ProductDetails} />
      <Route exact path="/products" component={Products} />
      <Route path="/products/:keyword" component={Products} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/login" component={LoginSignUp} />
      <ProtectedRoute exact path="/account" component={Profile} />
      <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
      <Route exact path="/password/forgot" component={ForgotPassword} />
      <Route exact path="/password/reset/:token" component={ResetPassword} />
      <Route exact path="/cart" component={Cart} />
      <ProtectedRoute
        exact
        path="/password/update"
        component={UpdatePassword}
      />
      <ProtectedRoute exact path="/shipping" component={Shipping} />
      <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}
      <ProtectedRoute exact path="/success" component={OrderSuccess} />
      <Footer />
    </Router>
  );
}

export default App;
