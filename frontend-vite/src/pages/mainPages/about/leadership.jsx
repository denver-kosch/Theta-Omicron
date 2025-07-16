import { useEffect, useState, Fragment } from "react";
import api from "@/services/apiCall";
import BrothersGrid from "@/components/cardGrid";

const Leadership = () => {
    const [leadership, setLeadership] = useState([]);
    const [ec, setEC] = useState([]);

    useEffect(() => {
        const fetchLeaders = async () => {
            const res = await api('getChairmen');
            if (res.success) {
                res.chairmen = res.chairmen.map(chairman => ({
                    ...chairman,
                    position: chairman.positions.map((position, index, array) => (
                      <Fragment key={index}>
                        {/Committee/.test(position.committeeName) ? `${position.committeeName.split(" ")[0]} ${position.role}` : `${position.committeeName}`}
                        {index < array.length - 1 && <br />}
                      </Fragment>
                    ))
                }));
                setLeadership(res.chairmen);
            }

            const ec = await api("getCommittee", {name: "Executive Committee", pics: true});
            if (ec.success) setEC(ec.members.sort((a,b) => a.position.ecOrder - b.position.ecOrder))
        };
        fetchLeaders();
    },[]);



    const ExecComponent = () => {
        const [expandedCard, setExpandedCard] = useState(null);
        const handleCardClick = (index) => setExpandedCard(expandedCard === index ? null : index);
        const allCollapsed = expandedCard === null;
      
        return (
          ec.length !== 0 && (
            <div className={`exec ${allCollapsed ? 'all-collapsed' : ''}`}>
              {ec.map((member, index) => (
                <div
                  key={index}
                  className={`bioCard ${expandedCard === index ? 'expanded' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="pic">
                    <img src={member.imageUrl} alt={member.name} />
                    <h3 className="title">{member.position.role}</h3>
                    <p className="name">{`${member.firstName} ${member.lastName}`}</p>
                  </div>
                  <p className="bio">{member.position.bio}</p>
                </div>
              ))}
            </div>
          )
        );
    };


    return (
        <div className="leadership">
            <h1>Chapter Leadership</h1>

            <h2>Executive Committee</h2>
            <ExecComponent/>

            <h2>Committee Chairmen</h2>
            <table className="chairmen">
                <BrothersGrid brothers={leadership}/>
            </table>
        </div>
)}

export default Leadership;