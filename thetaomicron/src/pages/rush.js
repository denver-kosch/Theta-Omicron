import React, { useEffect, useState } from "react";
import "./pagesCSS/rush.css";
import { apiCall } from "../components/apiCall";

const Rush = () => {
    const [rushCom, setRush] = useState([]);
    const [rushComErr, setRushErr] = useState("");

    useEffect(()=>{
        getRush();
    },[]);

    const getRush = async () => {
        try {
            let committee = await apiCall('get-rush', {});
            if (committee) {
                setRush(committee.members);
                console.log(committee.msg);
                console.log(committee.members);
            }
            else setRushErr("Could not gather rush committee at this time!");
        } catch (error) {
            console.error("Failed to fetch rush committee:", error);
            setRushErr("Could not gather rush committee at this time due to an error.");
        }
    }
     //eslint-disable-next-line
    const addMem = async () => {
        try {
            let newMem = {
                email: "dkosch2@gmail.com",
                password: "test",
                fName: "Denver",
                lName: "Kosch",
                status: "Initiate",
                phone: "17402437103",
                street: "12227 Ohio Ave",
                city: "Millersport",
                state: "OH",
                zip: "43046",
                initiation: 2022,
                graduation: 2025
            };

            let result = await apiCall('add-member', newMem);

            if (result) alert("Member added successfully!");
        } catch (error) {
            alert(`Error adding member:\n${error}`);
        }

    }

    const renderRush = (member) => {
        const name = `${member.firstName} ${member.lastName}`;
        const img = `../images/profilePics/${member.memberId}.png`;
        
        return (
            <div key={member.memberId} className="card">
                <img src={img} alt='name' style={{height: '200px', width: 'auto'}} />
                <p>{name}</p>
                <p>{member.title}</p>
            </div>
        );
    };

    return (
      <div className="container">
        <h1>WHY KAPPA SIGMA?</h1>
        <img src="/images/rush.jpeg" alt="Rush KΣ" className="rushPic" />

        <p>Kappa Sigma is a brotherhood that prides itself on being the best of the fraternal world. At an international level, Kappa Sigma has been the best at what it does for over two decades, and we've stayed just as committed on Muskingum University's campus since out charting one decade ago. We pride ourselves on being true gentlemen who distinguish themselves by emphazing the values of the 4 pillars of Kappa Sigma: Fellowship, Leadership, Scholarship, and Service.</p>
        
        <br/>
        
        <h4>If you are interested in joining the greatest in the world, reach out to any of the brothers of the Rush Committee:</h4>
        <h5 style={{color: 'red'}}>{rushComErr}</h5>

        <div style={{direction: 'flex'}}>
            {rushCom.map(member => renderRush(member))}
        </div>
      </div>
    );
  }

  export default Rush;