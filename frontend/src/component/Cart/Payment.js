import React, { Fragment, useEffect, useRef } from "react";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { Typography } from "@material-ui/core";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAlert } from "react-alert";

import "./Payment.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createOrder } from "../../actions/orderAction";

const Payment = ({ history }) => {
  const alert = useAlert();
  const payBtn = useRef(null);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subTotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disbaled = true;

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/v1/process/payment",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;

        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          history.push("/success");
        } else {
          alert.error("There is some issue while processing payments.");
        }
      }
    } catch (error) {
      payBtn.current.disbaled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      <MetaData title="Process Payment" />
      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            ref={payBtn}
            className="paymentFormBtn"
            value={120000}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
