import MemberCard from "./memberCard";
import { Fragment } from "react";
import type { BrothersGridProps, MemberPosition, MemberType } from "@/types";

const COLUMN_COUNT = 4;

const chunk = <T,>(items: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
};

const positionLabel = (position: MemberPosition | string) => {
    if (typeof position === "string") return position;

    const { committeeName, role, title } = position;
    if (!committeeName) return role ?? title ?? "";
    if (/Committee/.test(committeeName) && role === "Chairman") {
        return `${committeeName.split(" ")[0]} Chairman`;
    }
    return committeeName;
};

const BrothersGrid = ({brothers}: BrothersGridProps) => {
    const chapter = chunk(brothers, COLUMN_COUNT);

    const renderBrother = (brother: MemberType) => {
        const position = brother.position ?? brother.positions?.map((item, index, positions) => (
            <Fragment key={index}>
                {positionLabel(item)}
                {index < positions.length - 1 && <br/>}
            </Fragment>
        ));

        return <MemberCard member={{...brother, position}}/>;
    };

    return (
        <tbody>
            {chapter.map((row, rowIndex) =>
                <tr key={row[0]?._id ?? `row-${rowIndex}`} className="directoryRow">
                    {row.map((brother, columnIndex) => (
                        <td key={brother._id ?? `${brother.firstName}-${brother.lastName}-${columnIndex}`}>
                            {renderBrother(brother)}
                        </td>
                    ))}
                    {Array.from({length: COLUMN_COUNT - row.length}, (_, columnIndex) => (
                        <td key={`empty-${columnIndex}`} aria-hidden="true"></td>
                    ))}
                </tr>
            )}
        </tbody>
    );
};

export default BrothersGrid;
