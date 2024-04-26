import React, { useEffect, useState } from "react";
import RushGraphic from "../images/rush.jpeg";
import "./pagesCSS/rush.css";

const Rush = () => {
    // eslint-disable-next-line
    const [rushCom, setRush] = useState([]);

    useEffect(()=>{
        getRush();
    } , []);

    const getRush = async () => {
        try {

        } catch  (err) {
            console.log("Error getting Rush Committee: ", err);
        }
     }


    return (
      <div className="container">
        <img
            src={RushGraphic}
            alt="Rush KΣ"
            className="rushPic"
        />

        <p>Kappa Sigma is a brotherhood that prides itself on being the best of the fraternal world. At an international level, Kappa Sigma has been the best at what it does for over two decades, and we've stayed just as committed on Muskingum University's campus since out charting one decade ago. We pride ourselves on being true gentlemen who distinguish themselves by emphazing the values of the 4 pillars of Kappa Sigma: Fellowship, Leadership, Scholarship, and Service.</p>
        
        <br/>
        
        <h4>If you are interested in joining the greatest in the world, reach out to any of the brothers of the Rush Committee:</h4>
      </div>
    );
  }

  export default Rush;