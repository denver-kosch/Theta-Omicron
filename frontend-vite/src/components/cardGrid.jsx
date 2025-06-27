import MemberCard from "./memberCard";
import { Fragment } from "react";

const BrothersGrid = ({brothers}) => {

    const chunk = (arr, size) => {
      const chunkedArr = [];
      for (let i = 0; i < arr.length; i += size) chunkedArr.push(arr.slice(i, i + size));
      return chunkedArr;
    };
    console.log(brothers)
    const chapter = chunk(brothers, 4);

    const renderBrother = brother => {
      brother.position ??= brother.positions.map((position, index, array) => (
        <Fragment key={index}>
            {position}{index < array.length - 1 && <br/>}
        </Fragment>
      ));
      return <MemberCard member={brother}/>
    };

    return (
      <tbody>
        {chapter.map((row, index) => 
          <tr key={index} className="directoryRow">
            {row.map((item, idx) => <td key={idx}>{renderBrother(item)}</td>)}
            {row.length < 4 && new Array(4 - row.length).fill(null).map((_, idx) => <td key={idx}></td>)}
          </tr>
        )}
      </tbody>
    );
};

export default BrothersGrid;