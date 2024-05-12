import React, { useEffect, useState } from "react";
import "./../styles.css";
import { apiCall } from "../../../components/apiCall";

const Rush = () => {
    const [rushCom, setRush] = useState([]);
    const [rushComErr, setRushErr] = useState("");

    useEffect(()=>{
        getRush();
    },[]);

    useEffect(()=>{
        console.log("Rush Com: " + rushCom);
    }, [rushCom]);

    const getRush = async () => {
        try {
            let committee = await apiCall('getRush');
            if (committee) {
                setRush(committee.members);
                console.log(committee.members);
            }
            else setRushErr("Could not gather rush committee at this time!");
        } catch (error) {
            console.error("Failed to fetch rush committee:", error);
            setRushErr("Could not gather rush committee at this time due to an error.");
        }
    }

    const renderRush = (member, title) => {
        const name = `${member.firstName} ${member.lastName}`;
        const img = `/images/profilePics/${member.memberId}.jpg`;
        const emailLink  = `mailto:${member.schoolEmail}@muskingum.edu?subject=Interested In Kappa Sigma`;
        
        return (
            <div key={member.memberId} className="card">
                <a href={emailLink}>
                    <div>
                        <img src={img} alt={name} className="profilePic"/>
                        <img src="/images/mail.png" className="emailIcon" alt="Email" />
                    </div>
                </a>
                <p>{name}</p>
                <p style={{fontWeight: 'bold'}}>{title}</p>
            </div>
        );
    };

    const newRush = () => {
        console.log('rendering...');
        const gmc = rushCom.supervisingOfficer;
        const chairman = rushCom.Members.find(r => r.CommitteeMember.isChairman);
        const committee = rushCom.Members.filter(r => !r.CommitteeMember.isChairman);

        return (
            <>
            <div className="committee">
                {renderRush(gmc.Member, gmc.title)}
                {renderRush(chairman, "Rush Chairman")}
            </div>
            <div className="committee">
                {committee.map(member => renderRush(member, "Rush Committee"))}
            </div>
            </>
        );

    };

    return (
      <div className="container">
        <h1>WHY KAPPA SIGMA?</h1>
        <div className="aboutRush">
            <div>
                <p>Kappa Sigma is a Brotherhood that prides itself on being the best of the fraternal world. At an international level, Kappa Sigma has been the best at what it does for over two decades, and we've stayed just as committed on Muskingum University's campus since our charting one decade ago. We pride ourselves on being true gentlemen who distinguish themselves by emphazing the values of the 4 pillars of Kappa Sigma: Fellowship, Leadership, Scholarship, and Service.</p>
                <a className='rushFormBtn' href="https://forms.gle/oEf4BuAA4agaAHo56" target="_blank" rel="noopener noreferrer">
                    <p>Interested in Kappa Sigma?<br/>Click Here</p>
                </a>
            </div>
            <img src="/images/rush.jpg" alt="Rush KΣ" className="rushPic" />
        </div>
        <br/>
        <h4>If you are interested in joining the greatest in the world, reach out to any of the Brothers of the Rush Committee:</h4>
            {(() => {
                if (rushComErr !== '') 
                return <h5 style={{color: 'red'}}>{rushComErr}</h5>;
            })()}
        {rushCom.length !== 0 &&
            <div className='committeeContainer'>
                {newRush()}
            </div>
        }
      </div>
    );
  }

  export default Rush;