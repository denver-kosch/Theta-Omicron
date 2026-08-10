import { useEffect, useState } from "react";
import api from "@/services/apiCall";
import BrothersGrid from "@/components/cardGrid";
import type { ApiResponse, ChairmanMemberType, ExecutiveCommitteeProps, ExecutiveMemberType } from "@/types";

const ExecutiveCommittee = ({members}: ExecutiveCommitteeProps) => {
	const [expandedCard, setExpandedCard] = useState<number | null>(null);
	const allCollapsed = expandedCard === null;

	const toggleCard = (index: number) => setExpandedCard(current => current === index ? null : index);

	if (members.length === 0) return <p>Loading...</p>;

	return (
		<div className={`exec ${allCollapsed ? "all-collapsed" : ""}`}>
			{members.map((member, index) => (
				<div
					key={member._id ?? index}
					className={`bioCard ${expandedCard === index ? "expanded" : ""}`}
					role="button"
					tabIndex={0}
					onClick={() => toggleCard(index)}
					onKeyDown={event => {
						if (event.key === "Enter" || event.key === " ") toggleCard(index);
					}}
				>
					<div className="pic">
						<img src={member.imageUrl} alt={`${member.firstName} ${member.lastName}`}/>
						<h3 className="title">{member.position.role}</h3>
						<p className="name">{`${member.firstName} ${member.lastName}`}</p>
					</div>
					<p className="bio">{member.position.bio}</p>
				</div>
			))}
		</div>
	);
};

const Leadership = () => {
	const [leadership, setLeadership] = useState<ChairmanMemberType[]>([]);
	const [ec, setEC] = useState<ExecutiveMemberType[]>([]);

	useEffect(() => {
		const fetchLeaders = async () => {
			const leadersResponse = await api("brothers?chairmen=true") as ApiResponse<{ bros: { chairmen: ChairmanMemberType[] }; }>;
			if (leadersResponse.success) setLeadership(leadersResponse.bros.chairmen);

			const executiveResponse = await api("committees/Executive Committee?pics=true") as ApiResponse<{ members: ExecutiveMemberType[]; }>;
			if (executiveResponse.success) setEC([...executiveResponse.members].sort((a, b) => a.position.ecOrder - b.position.ecOrder));
			
		};
		fetchLeaders();
	},[]);
	return (
		<div className="leadership">
			<h1>Chapter Leadership</h1>

			<h2>Executive Committee</h2>
			<ExecutiveCommittee members={ec}/>

			<h2>Committee Chairmen</h2>
			<table className="chairmen">
				<BrothersGrid brothers={leadership}/>
			</table>
		</div>
	);
};

export default Leadership;
