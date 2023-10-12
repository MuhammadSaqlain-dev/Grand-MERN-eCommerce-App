import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";

import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { clearErrors, updateProfile } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";

const UpdateProfile = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const { user } = useSelector((state) => state.user);

  const { loading, isUpdated, error } = useSelector((state) => state.profile);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("profile updated successfully!");
      history.push("/account");
      window.location.reload();

      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, error, history, isUpdated, user]);

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <MetaData title="Update User Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UpdateProfile;
