import { useEffect, useState } from "react";
import "./../styles.css";
import { apiCall } from "../../../components/apiCall";

const AboutUs = () => {
    const [ec, setEC] = useState([]);
    const  [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        //If token from previous session, remove it
        if (localStorage.getItem('token')) localStorage.removeItem('token');
        
        getEC();
    }, []);

    const getEC = async () => {
        let ec =  await apiCall("getEC");
        if (ec.success) setEC(ec.members);
        else {
            setErrorMessage("Could not gather Executive Committee at this time!");
            console.log(ec.error);
        }
    };

    const renderEC = officer => {
        const name = `${officer.firstName} ${officer.lastName}`;
        const img = `/images/profilePics/${officer.memberId}.jpg`;
        
        return (
            <div key={officer.memberId} className="card">
                <img src={img} alt={name} className="profilePic"/>
                <p>{name}</p>
                <p style={{fontWeight: 'bold'}}>{officer.Officer.title}</p>
            </div>
        );
    };

    return (
        <div className="container">
            <h2>WHO ARE WE:</h2>
            <img 
                src={`/images/formalSP23.jpg`}
                alt="Brothers of the Theta-Omcrion Chapter of Kappa Sigma"
                className="mainPageImg"
            />
            <br/>
            <div className="aboutHome">
                <p>
                    Kappa Sigma's Theta-Omicron Chapter at Muskingum University originally began as the Sphinx Club.
                    In 1966, Sphinx Club was absorbed into and chartered by the International Kappa Sigma Fraternity
                    on Muskingum's campus and has continued to thrive since then.
                </p>
            </div>
            <br/>
            <h3 style={{fontWeight: 'bold'}}>Meet the Executive Committee:</h3>
            <div className="ExecContainer">
                {(ec.length === 0 && errorMessage === "") ? <p>Loading...</p>:
                errorMessage !== "" ? <p style={{color: 'red'}}>{errorMessage}</p> :
                ec.map(officer => renderEC(officer))
                }
            </div>


        </div>
    );
}

export default AboutUs;