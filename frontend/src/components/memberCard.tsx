import type { MemberCardProps, MemberPosition, MemberType } from "@/types";

const isMemberPosition = (position: MemberType["position"]): position is MemberPosition =>
	typeof position === "object" &&
	position !== null &&
	!Array.isArray(position) &&
	("role" in position || "title" in position || "committeeName" in position);

const emailHref = (schoolEmail?: string, personalEmail?: string) => {
	const address = schoolEmail
		? schoolEmail.includes("@") ? schoolEmail : `${schoolEmail}@muskingum.edu`
		: personalEmail;
	return address ? `mailto:${address}?subject=Interested%20In%20Kappa%20Sigma` : null;
};

const MemberCard = ({member}: MemberCardProps) => {
	const { firstName, lastName, contactInfo, imageUrl, position } = member;
	const name = `${firstName} ${lastName}`;
	const title = isMemberPosition(position) ? position.role ?? position.title ?? position.committeeName ?? "" : position;
	const email = emailHref(contactInfo?.schoolEmail, contactInfo?.email);

	return (
		<div className="card">
		{email ?
			<a href={email}>
				<div>
					<img src={imageUrl} alt={name} className="profilePic"/>
					<img className="emailIcon" alt="Email" />
				</div>
			</a> : 
			<img src={imageUrl} alt={name} className="profilePic"/>
		}
		<p>{name}</p>
		<p style={{fontWeight: "bold"}}>{title}</p>
		</div>
	);
};

export default MemberCard;
