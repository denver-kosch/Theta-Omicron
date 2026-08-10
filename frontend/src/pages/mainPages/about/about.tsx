import { useEffect, useState } from "react";
import Divider from "@/components/divider";
import { Link } from "react-router-dom";
import api from "@/services/apiCall";
import MemberCard from "@/components/memberCard";
import type { ApiResponse, ExecutiveMemberType } from "@/types";

const VertLine = () => <div className="vertical"/>;

const Converge = () => (
	<div className="convergeCon" aria-hidden="true">
		<svg viewBox="0 0 1000 120" preserveAspectRatio="none" focusable="false">
			<path d="M 250 0 L 500 80 L 750 0"/>
			<path d="M 500 80 L 500 120"/>
		</svg>
	</div>
);

const AboutUs = () => {
	const [ec, setEC] = useState<ExecutiveMemberType[]>([]);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		const getEC = async () => {
			const response = await api("committees/Executive Committee?pics=true") as ApiResponse<{ members: ExecutiveMemberType[]; }>;
			if (response.success) setEC([...response.members].sort((a, b) => a.position.ecOrder - b.position.ecOrder));
			else {
				setErrMsg("Could not gather Executive Committee at this time!");
				console.error(response.error);
			}
		};

		getEC();
	}, []);

	return (
		<>
			<h2>WHO ARE WE:</h2>
			<img alt="Brothers of the Theta-Omicron Chapter of Kappa Sigma" className="aboutPageImg"/>
			<br/>
			<div className="aboutBasic">
				<p>
					Kappa Sigma's Theta-Omicron Chapter at Muskingum University originally began as the Sphinx Club.
					In 1966, Sphinx Club was absorbed into and chartered by the International Kappa Sigma Fraternity
					on Muskingum's campus and has continued to thrive since then.
				</p>
			</div>

			<Divider/>

			<div className="story">
				<h2>HISTORY OF THE CHAPTER</h2>
				<div className="storyContainer">
					<div className="flexContainer">
						<div className="column">
							<h3>KAPPA SIGMA</h3>
							<p>
								Kappa Sigma was originally founded at the University of Virginia, in Charlottesville, in 1869.
								Founders Boyd, Rogers, McCormick, Arnold, and Nicodemus started the fraternity as formal structure
								of their friendship, which might be further spread across campus. Thus, the Zeta Chapter was born.
							</p>
							<VertLine/>
							<p>
								Zeta Initiate Stephen Alonzo Jackson dreamed of and stoked the desire in every Brother to
								make Kappa Sigma the greatest Fraternity, a pride and joy of every college campus.
								Thus, Champion Quest was formed. <br/>
							</p>
						</div>
						<div className="column">
							<h3>SPHINX CLUB</h3>
							<p>
								The Sigma Phi Chi "Sphinx" Club was founded in 1920 by a group of men at Muskingum University.
								The club was founded on the principles of friendship, truth, and honor, and acted as
								a social club that focused on promoting brotherhood and camaraderie among its members.
							</p>
							<VertLine/>
							<p>
								In 1966, Sphinx Club Presidential Candidate Richard L. Smith recommended that in order to more effectively
								grow and spread their brotherhood, Sphinx should incorporate into a larger fraternity. Hence they started
								their search until they came across Kappa Sigma.
							</p>
						</div>
					</div>
					<Converge/>
					<p className="storyConclusion">
						In 1966, the Sphinx Club formally incorporated into the Kappa Sigma Fraternity,
						and the Theta-Omicron Chapter was born. Since then, the Chapter has grown and thrived,
						and has become a hallmark of fraternal success in Muskingum's community.
					</p>
				</div>
			</div>

			<Divider/>

			<br/>
			<h3 style={{fontWeight: "bold"}}>Meet the Executive Committee:</h3>
			<div className="ExecContainer">
				{errMsg
					? <p style={{color: "red"}}>{errMsg}</p>
					: ec.length === 0
						? <p>Loading...</p>
						: ec.map((officer, index) => <MemberCard key={officer._id ?? index} member={officer}/>)}
			</div>
			<p>Meet them and other Leaders in the Chapter <Link to="/about/leadership" className="easyLink">here</Link></p>
		</>
	);
};

export default AboutUs;
