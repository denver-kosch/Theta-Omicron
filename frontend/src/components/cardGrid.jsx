import MemberCard from "./memberCard";
import { Fragment, useMemo } from "react";

const CARDS_PER_ROW = 4;

const chunk = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

const BrothersGrid = ({brothers}) => {
    const chapter = useMemo(() => chunk(brothers, CARDS_PER_ROW), [brothers]);

    const renderBrother = brother => {
        const position = brother.position ?? brother.positions?.map((item, index, array) => (<Fragment key={item}>{item}{index < array.length - 1 && <br/>}</Fragment>));
        return <MemberCard member={{...brother, position}}/>;
    };

    return (
        <tbody>
            {chapter.map((row, index) => 
                <tr key={index} className="directoryRow">
                    {row.map(item => <td key={item._id}>{renderBrother(item)}</td>)}
                    {Array.from({length: CARDS_PER_ROW - row.length}, (_, index) => <td key={`empty-${index}`} />)}
                </tr>
            )}
        </tbody>
    );
};

export default BrothersGrid;
