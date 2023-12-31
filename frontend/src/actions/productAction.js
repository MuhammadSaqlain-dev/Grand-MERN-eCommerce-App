import {
  ALL_PRODUCTS_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  ALL_REVIEW_FAIL,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/productConstants.js";

import axios from "axios";
import { server } from "../server.js";

export const getProducts =
  (keyword = "", currentPage = 1, price = [0, 25000], category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });

      let link = `${server}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if (category) {
        link = `${server}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
      }

      const { data } = await axios.get(link);
      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// get products for admin
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/admin/products`, {
      withCredentials: true,
    });
    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// create product - admin
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const { data } = await axios.post(
      `${server}/api/v1/admin/product/new`,
      productData,
      { withCredentials: true }
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// update product - admin
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await axios.put(
      `${server}/api/v1/admin/product/${id}`,
      productData,
      { withCredentials: true }
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// delete product - admin
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await axios.delete(
      `${server}/api/v1/admin/product/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get single product details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`${server}/api/v1/product/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// add/ edit new review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const { data } = await axios.put(`${server}/api/v1/review`, reviewData, {
      withCredentials: true,
    });

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get product reviews - admin
export const getAllReviews = (id) => async (dispatch) => {
  // id = productId
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/reviews/?id=${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// delete review - admin
export const deleteReviews = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
      `${server}/api/v1/reviews/?id=${reviewId}&productId=${productId}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

//  clearing the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
