import { useState } from "react";
import { Link } from "react-router-dom";

export const DropDown = ({content}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {parent, children} = content;
    console.log(children);

    return (
    <div className="dropButton" onMouseOver={() => setIsOpen(true)} onMouseOut={() => setIsOpen(false)}>
        <Link className="navLink" to={parent.link} onClick={() => setIsOpen(false)}>
            <h3>{parent.title}</h3>
        </Link>
        {isOpen &&
        <div className="dropdown">
            {children.map(child => {return (
                <Link className="navLink" to={child.link} onClick={() => setIsOpen(false)}>
                    <h4>{child.title}</h4>
                </Link>
            )})}
        </div>
        }
    </div>
)}