import { useEffect, useState } from "react";
// import "./../styles.css";
import { apiCall } from "../../../components/apiCall";
import { Link } from "react-router-dom";
import Divider from "../../../components/divider";

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

    const VertLine = () => {return (<div className="vertical" />)};

    const Converge = () => {
        return (
            <div className="convergeCon">
                <div className="diagonal left"></div>
                <div className="diagonal right"></div>
                <div className="convertical"></div>
            </div>
        );
    };

    return (
        <>
            <h2>WHO ARE WE:</h2>
            <img 
                src={`/images/formalSP23.jpg`}
                alt="Brothers of the Theta-Omcrion Chapter of Kappa Sigma"
                className="aboutPageImg"
            />
            <br/>
            <div className="aboutBasic">
                <p>
                    Kappa Sigma's Theta-Omicron Chapter at Muskingum University originally began as the Sphinx Club.
                    In 1966, Sphinx Club was absorbed into and chartered by the International Kappa Sigma Fraternity
                    on Muskingum's campus and has continued to thrive since then.
                </p>
            </div>

            <Divider/>

            <div className='story'>
                <h2>HISTORY OF THE CHAPTER</h2>
                <div className="storyContainer">
                    <div className="flexContainer">
                        <div className="column">
                            <h3>SPHINX CLUB</h3>
                            <p>
                                The Sigma Phi Chi "Sphinx" Club was founded in 1920 by a group of students at Muskingum University.
                                The club was founded on the principles of friendship, truth, and honor, and acted 
                                a social club that focused on promoting brotherhood and camaraderie among its members.
                            </p>
                            <VertLine/>
                            <p>
                                In 1966, Sphinx Club Presidential Candiddate Richard L. Smith recommended that in order to more effectively 
                                grow and spread their brotherhood, Sphinx should incorporate into a larger fraternity. Hence they started 
                                their search until they came across Kappa Sigma.
                            </p>
                        </div>
                        <div className="column">
                            <h3>KAPPA SIGMA</h3>
                            <p>
                                Kappa Sigma was originally founded at the University of Virginia in Charlottesville in 1869.
                                Founders Boyd, Rogers, McCormick, Arnold, and Nicodemus started the fraternity as formal structure
                                of their friendship, which might be further spread across campus. Thus, the Zeta Chapter was born.
                            </p>
                            <VertLine/>
                            <p>
                                Zeta Initiate Stephen Alonzo Jackson dreamed of and inspired the desire in every Brother to
                                make Kappa Sigma the biggest Fraternity, and a pride and joy of every college campus. 
                                Thus, Champion quest was formed. <br/>
                            </p>
                        </div>
                    </div>
                    <Converge/>
                    <p style={{width: '60%'}}>
                        In 1966, the Sphinx Club formally incorporated into the Kappa Sigma Fraternity,
                        and the Theta-Omicron Chapter was born. Since then, the chapter has grown and thrived,
                        and has become a hallmark of fraternal success in the Muskingum University community.
                    </p>
                </div>
            </div>

            <Divider/>
            
            <br/>
            <h3 style={{fontWeight: 'bold'}}>Meet the Executive Committee:</h3>
            <div className="ExecContainer">
                {(ec.length === 0 && errorMessage === "") ? <p>Loading...</p>:
                errorMessage !== "" ? <p style={{color: 'red'}}>{errorMessage}</p> :
                ec.map(officer => renderEC(officer))
                }
            </div>
            <p>Meet them and other Leaders in the Chapter <Link to={"/about/leadership"} className="easyLink">here</Link></p>


        </>
    );
}

export default AboutUs;