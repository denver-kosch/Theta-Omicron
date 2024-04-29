import { useEffect, useState } from "react";
import "./pagesCSS/home.css";
import { apiCall } from "../components/apiCall";

const Home = () => {
    const [ec, setEC] = useState([]);
    const  [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        getEC();
    }, []);

    const getEC = async () => {
        try {
            let ec =  await apiCall("getEC");
            if (ec) {
                setEC(ec.members);
                console.log(ec.msg);
            }
            else setErrorMessage("Could not gather Executive Committee at this time!");
        } catch (error) {
            console.error("Failed to fetch EC:", error);
            setErrorMessage("Could not gather Executive Committee at this time due to an error.");
        }
    };

    const renderEC = officer => {
        const name = `${officer.firstName} ${officer.lastName}`;
        const img = `/images/profilePics/${officer.memberId}.jpg`;
        
        return (
            <div key={officer.memberId} className="card">
                <img src={img} alt={name} className="profilePic"/>
                <p>{name}</p>
                <p style={{fontWeight: 'bold'}}>{officer.title}</p>
            </div>
        );
    };

    return (
        <div className="homeContainer">
            <img 
                src={"/images/formalSP23.jpeg"}
                alt="Brothers of the Theta-Omcrion Chapter of Kappa Sigma"
                className="mainPageImg"
            />
            <div className="aboutHome">
                <h2>WHO ARE WE:</h2>
                <p>
                    Kappa Sigma's Theta-Omicron Chapter at Muskingum University originally began as the Sphinx Club.
                    <br/>In 1966, Sphinx Club was absorbed into and chartered by the International Kappa Sigma Fraternity
                    <br/>on Muskingum's campus and has continued to thrive since then.
                </p>
            </div>
            <br/>
            <h3 style={{fontWeight: 'bold'}}>Meet the Executive Committee:</h3>
            <div className="ExecContainer">
                {errorMessage !== "" ? <p style={{color: 'red'}}>{errorMessage}</p> :
                ec.map(officer => renderEC(officer))}
            </div>


        </div>
    );
}

export default Home;