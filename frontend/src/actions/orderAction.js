import {
  CLEAR_ERRORS,
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  MY_ORDERS_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ALL_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
} from "../constants/orderConstants";

import axios from "axios";
import { server } from "../server";

// create order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const { data } = await axios.post(`${server}/api/v1/order/new`, order, {
      withCredentials: true,
    });

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_ORDER_FAIL, payload: error.response.data.message });
  }
};

// my orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/orders/me`, {
      withCredentials: true,
    });

    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({ type: MY_ORDERS_FAIL, payload: error.response.data.message });
  }
};

// get Single order details action
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/order/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// admin
// get all orders - admin
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/admin/orders`, {
      withCredentials: true,
    });

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({ type: ALL_ORDERS_FAIL, payload: error.response.data.message });
  }
};

// update orders - admin
export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const { data } = await axios.put(
      `${server}/api/v1/admin/order/${id}`,
      orderData,
      { withCredentials: true }
    );

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_ORDER_FAIL, payload: error.response.data.message });
  }
};

// delete orders - admin
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`${server}/api/v1/admin/order/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: DELETE_ORDER_FAIL, payload: error.response.data.message });
  }
};

// clearing error
export const clearError = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
