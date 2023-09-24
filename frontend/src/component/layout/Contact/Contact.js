import React from "react";
import "./contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:2mesaqlain@gmail.com">
        <Button>Contact: 2mesaqlain@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
