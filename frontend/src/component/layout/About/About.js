import React from "react";
import "./about.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/muhammad-saqlainraza/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Me</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/darkdegwd/image/upload/v1694251158/avatars/t6nkixbzjoxciril4rkv.jpg"
              alt="Founder"
            />
            <Typography>Muhammad Saqlain Raza</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button>
            <span>
              This app is intended for practice purpose only. I made this app.
              And I use MERN tech in building this app. It was a lot of fun in
              developing the frontend and backend from stratch.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a href="https://github.com/MuhammadSaqlain-dev" target="blank">
              <GitHubIcon className="youtubeSvgIcon" />
            </a>

            <a
              href="https://www.linkedin.com/in/muhammad-saqlainraza/"
              target="blank"
            >
              <LinkedInIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
