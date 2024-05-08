const Card = ({ name, emailLink, memberId, title }) => {
    const img = `/images/profilePics/${memberId}.jpg`;

    return (
    <div key={memberId} className="card">
        <a href={emailLink}>
            <div>
                <img src={img} alt={name} className="profilePic"/>
                <img src="/images/mail.png" className="emailIcon" alt="Email" />
            </div>
        </a>
        <p>{name}</p>
        <p style={{fontWeight: 'bold'}}>{title}</p>
    </div>
)};

export default Card;