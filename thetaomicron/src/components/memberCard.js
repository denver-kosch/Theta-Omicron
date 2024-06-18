const MemberCard = ({member}) => {
    const { firstName, lastName, contactInfo, imageUrl, position } = member;
    const name = `${firstName} ${lastName}`;
    const title =  position.role ?? position;
    const email = contactInfo?.schoolEmail ? `mailto:${contactInfo.schoolEmail}@muskingum.edu?subject=Interested In Kappa Sigma` : 
                  contactInfo?.email ? contactInfo.email : null;


    return (
    email ? <div className="card">
        <a href={email}>
            <div>
                <img src={imageUrl} alt={name} className="profilePic"/>
                <img className="emailIcon" alt="Email" />
            </div>
        </a>
        <p>{name}</p>
        <p style={{fontWeight: 'bold'}}>{title}</p>
    </div> :
    <div className="card">
        <img src={imageUrl} alt={name} className="profilePic"/>
        <p>{name}</p>
        <p style={{fontWeight: 'bold'}}>{title}</p>
    </div>
)};

export default MemberCard;