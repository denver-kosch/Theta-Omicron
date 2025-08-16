import { useEffect, useState } from "react";
import api from "@/services/apiCall";
import MemberCard from "@/components/memberCard";

const Rush = () => {
    const [rushCom, setRush] = useState([]);
    const [rushComErr, setRushErr] = useState("");
    const [link, setLink] = useState("");

    useEffect(()=>{
        getRush();
    },[]);

    const getRush = async () => {
        try {
            const committee = await api('committees/Rush?emails=true&pics=true&link=true', {name: "Rush Committee", emails: true, pics: true});
            committee?.success ? (setRush(committee.members), setLink(committee.link)) : setRushErr("Could not gather rush committee at this time!");
        } catch (error) {
            console.error("Failed to fetch rush committee:", error);
            setRushErr("Could not gather rush committee at this time due to an error.");
        }
    };


    const RushCom = () => {
        const gmc = rushCom.find(r => r.position.role === "Grand Master of Ceremonies");
        const chairman = rushCom.find(r => r.position.role === "Chairman");
        const committee = rushCom.filter(r => r.position.role === "Member").map(r => ({...r, position:"Committee Member"}));
        return (
            <>
                <div className="committee">
                    <MemberCard member={gmc}/>
                    <MemberCard member={chairman}/>
                </div>
                <div className="committee">
                    {committee.map(member => <MemberCard key={member._id} member={member}/>)}
                </div>
            </>
    )};

    return (
      <>
        <h1>WHY KAPPA SIGMA?</h1>
        <div className="aboutRush">
            <div>
                <p>Kappa Sigma is a Brotherhood that prides itself on being the best of the fraternal world. At an international level, Kappa Sigma has been the best at what it does for over two decades, and we've stayed just as committed on Muskingum University's campus since our charting one decade ago. We pride ourselves on being true gentlemen who distinguish themselves by emphazing the values of the 4 pillars of Kappa Sigma: Fellowship, Leadership, Scholarship, and Service.</p>
                <a className='rushFormBtn' href={link} target="_blank" rel="noopener noreferrer">
                    <p>Interested in Kappa Sigma?<br/>Click Here</p>
                </a>
            </div>
            <img alt="Rush KΣ" className="rushPic" />
        </div>
        <br/>
        <h4>If you are interested in joining the greatest in the world, reach out to any of the Brothers of the Rush Committee:</h4>
        {(rushComErr !== "") && <h5 style={{color: 'red'}}>{rushComErr}</h5>}
        {rushCom.length !== 0 &&
            <div className='committeeContainer'>
                <RushCom/>
            </div>
        }
      </>
    );
}

  export default Rush;