import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/userConstants.js";
import axios from "axios";
import { server } from "../server.js";

// login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(
      `${server}/api/v1/login`,
      { email, password },
      { withCredentials: true }
    );

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

// register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const { data } = await axios.post(`${server}/api/v1/register`, userData, {
      withCredentials: true,
    });

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/me`, {
      withCredentials: true,
    });

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};

// logout
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${server}/api/v1/logout`, { withCredentials: true });

    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const { data } = await axios.put(`${server}/api/v1/me/update`, userData, {
      withCredentials: true,
    });

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// update password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const { data } = await axios.put(
      `${server}/api/v1/password/update`,
      passwords,
      { withCredentials: true }
    );

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const { data } = await axios.post(
      `${server}/api/v1/password/forgot`,
      email,
      { withCredentials: true }
    );

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const { data } = await axios.put(
      `${server}/api/v1/password/reset/${token}`,
      passwords,
      { withCredentials: true }
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

//  get all users - admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/admin/users`, {
      withCredentials: true,
    });

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
  }
};

// get single user details - admin
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { data } = await axios.get(`${server}/api/v1/admin/user/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
  }
};

// update user role - admin
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const { data } = await axios.put(
      `${server}/api/v1/admin/user/${id}`,
      userData,
      { withCredentials: true }
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// delete user - admin
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`${server}/api/v1/admin/user/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
