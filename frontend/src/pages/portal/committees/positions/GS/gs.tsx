import MinutesDashboard from "./MinutesDashboard";
import type { StyleProps } from "@/types";

const ImportantLinks = () => {
	const links = [
		{ name: "KappaSig.net", url: "https://www.kappasig.net/"},
		{ name: "National Archives Submission", url: "https://formstack.io/1178A"},
		{ name: "Caduceus Submission", url: "https://formstack.io/143A4"}
	];

	return (
		<div className="important-links">
			<h2>Important Links</h2>
			<ul>
				{links.map(link => (
					<li key={link.url}>
						<a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
					</li>
				))}
			</ul>
		</div>
	)
};

const GSOutline = ({style}: StyleProps) => (
		<div className="gs-outline" style={style}>
			<p>As the Grand Scribe, you are responsible for maintaining the records of the Fraternity. This includes:</p>
			<ul>
				<li>Recording meeting minutes</li>
				<li>Managing correspondence (social media is included here)</li>
				<li>Maintaining the Chapter's archives (submit to HQ)</li>
			</ul>
			<p>Please ensure all records are accurate and up to date, and thank you, Brother Grand Scribe, for your hard work!</p>
		</div>
	);

const GS = () => {
	return (
		<div className="gs-component">
			<h2>Grand Scribe Dashboard</h2>
			<div className="gs-subcomponents">
				<div className="gs-subcomponent">
					<MinutesDashboard style={{ width: "50%",}} />
					<GSOutline style={{ width: "50%", justifyContent: 'center' }} />
				</div>
				<div className="gs-subcomponent" >
					<ImportantLinks />
				</div>
			</div>
		</div>
	);
};

export default GS;
