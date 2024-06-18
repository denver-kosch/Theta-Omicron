import { useEffect, useState, Fragment } from "react";
import apiCall from "../../../services/apiCall";
import MemberCard from "../../../components/memberCard";

const Directory = () => {
  const [brothers, setBrothers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [criteria, setCriteria] = useState("");

  useEffect(() => {
    getBrothers()
  },[]);

  const getBrothers = async () => {
    let response = await apiCall("getBros");
    console.log(response);
    setIsLoading(false);
    if (response && response.success) {
      setBrothers(response.bros);
    }
    else {
      setError("Could not load directory at this time");
      console.log(response);
    }
  };

  const Chapter = () => {

    const chunk = (arr, size) => {
      const chunkedArr = [];
      for (let i = 0; i < arr.length; i += size) chunkedArr.push(arr.slice(i, i + size));
      return chunkedArr;
    };

    const filteredData = brothers.filter(item => item.firstName.toLowerCase().includes(criteria.toLowerCase()) 
    || item.lastName.toLowerCase().includes(criteria.toLowerCase())
    || item.positions.some(pos => pos.toLowerCase().includes(criteria.toLowerCase())));

    const chapter = chunk(filteredData, 4);

    const renderBrother = brother => {
      brother.position = brother.positions.map((position, index, array) => (
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

  return (
    <div className="directoryContainer">
      <div className="topBar">
      <div>
          {/* <Link to="trees" className="famTree">
            <h3>Family Trees</h3>
          </Link> */}
        </div>
        <div>
          <h1>BROTHERS DIRECTORY:</h1>
        </div>
        <div>
          <input
          type="text"
          placeholder="Search..."
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          />
        </div>
      </div>

      <br/>

      {isLoading && <h3>Loading...</h3>}
      {!isLoading &&
      <table className="directory">
        <Chapter/>
      </table>
      }
      {(!isLoading && error !== '') && <h4 style={{color: 'red'}}>{error}</h4>}
    </div>
  );
}

export default Directory;