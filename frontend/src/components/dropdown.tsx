import type { DropdownProps } from "@/types";
import { useState } from "react";
import { Link } from "react-router-dom";

const DropDown = ({content}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const {parent, children} = content;

	return (
	<div
		className="dropButton"
		onMouseEnter={() => setIsOpen(true)}
		onMouseLeave={() => setIsOpen(false)}
		onFocus={() => setIsOpen(true)}
		onBlur={event => {
			if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
		}}
	>
		<Link className="navLink" to={parent.link} onClick={() => setIsOpen(false)}>
			<h3>{parent.title}</h3>
		</Link>
		{isOpen && (
			<div className="dropdown">
				{children.map(child => (
					<Link key={child.link} className="navLink" to={child.link} onClick={() => setIsOpen(false)}>
						<h4>{child.title}</h4>
					</Link>
				))}
			</div>
		)}
	</div>
	);
};

export default DropDown;
