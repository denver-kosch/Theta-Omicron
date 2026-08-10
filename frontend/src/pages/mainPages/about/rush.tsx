import { useEffect, useState } from "react";
import api from "@/services/apiCall";
import MemberCard from "@/components/memberCard";
import type { ApiResponse, CommitteeMemberType, MemberType } from "@/types";

const Rush = () => {
    const [rushCommittee, setRushCommittee] = useState<CommitteeMemberType[]>([]);
    const [error, setError] = useState("");
    const [link, setLink] = useState("");

    useEffect(() => {
        const getRushCommittee = async () => {
            try {
                const response = await api("committees/Rush?emails=true&pics=true&link=true") as ApiResponse<{ members: CommitteeMemberType[]; link: string; }>;
                if (response.success) {
                    setRushCommittee(response.members);
                    setLink(response.link);
                } else setError("Could not gather rush committee at this time!");
            } catch (requestError) {
                console.error("Failed to fetch rush committee:", requestError);
                setError("Could not gather rush committee at this time due to an error.");
            }
        };

        void getRushCommittee();
    }, []);

    const gmc = rushCommittee.find(member => member.position.role === "Grand Master of Ceremonies");
    const chairman = rushCommittee.find(member => member.position.role === "Chairman");
    const committeeMembers: MemberType[] = rushCommittee
        .filter(member => member.position.role === "Member")
        .map(member => ({...member, position: "Committee Member"}));

    return (
        <>
            <h1>WHY KAPPA SIGMA?</h1>
            <div className="aboutRush">
                <div>
                    <p>Kappa Sigma is a Brotherhood that prides itself on being the best of the fraternal world. At an international level, Kappa Sigma has been the best at what it does for over two decades, and we've stayed just as committed on Muskingum University's campus since our chartering one decade ago. We pride ourselves on being true gentlemen who distinguish themselves by emphasizing the values of the 4 pillars of Kappa Sigma: Fellowship, Leadership, Scholarship, and Service.</p>
                    <a className="rushFormBtn" href={link} target="_blank" rel="noopener noreferrer">
                        <p>Interested In Kappa Sigma?<br/>Click Here</p>
                    </a>
                </div>
                <img alt="Rush KΣ" className="rushPic"/>
            </div>
            <br/>
            <h4>If you are interested in joining the greatest in the world, reach out to any of the Brothers of the Rush Committee:</h4>
            {error && <h5 style={{color: "red"}}>{error}</h5>}
            {rushCommittee.length > 0 && (
                <div className="committeeContainer">
                    <div className="committee">
                        {gmc && <MemberCard member={gmc}/>} 
                        {chairman && <MemberCard member={chairman}/>} 
                    </div>
                    <div className="committee">
                        {committeeMembers.map((member, index) => (
                            <MemberCard key={member._id ?? index} member={member}/>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Rush;
