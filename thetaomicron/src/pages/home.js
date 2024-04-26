import React from "react";
import "./pagesCSS/home.css";
import Placeholder from "../images/formalSP23.jpeg";

const Home = () => {
    return (
        <div className="container">
            <img 
                src={Placeholder}
                alt="Brothers of the Theta-Omcrion Chapter of Kappa Sigma"
                className="mainPage"
            />
            <div className="about">
                <h2>Who are we:</h2>
                <p>Kappa Sigma's Theta-Omicron Chapter at Muskingum University originally began as the Sphinx Club.
                    <br/>In 1966, Sphinx Club was absorbed into and chartered by the International Kappa Sigma Fraternity
                    <br/>on Muskingum's campus and has continued to thrive since then.
                </p>
            </div>
        </div>
    );
  }

  export default Home;