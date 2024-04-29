import { useEffect, useState, Fragment } from "react";
import './pagesCSS/dir.css';
import { Link } from "react-router-dom";
import { apiCall } from "../components/apiCall";

const Directory = () => {
  const [brothers, setBrothers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [criteria, setCriteria] = useState("");

  useEffect(() => {
    getBrothers();
  },[]);

  const getBrothers = async () => {
    let response = await apiCall("getBros");
    setIsLoading(false);
    if (response && response.brothers) {
      setBrothers(response.brothers);
    }
    else setError("Could not load directory at this time");
  }

  const renderChapter = () => {

    const chunk = (arr, size) => {
      const chunkedArr = [];
      for (let i = 0; i < arr.length; i += size) chunkedArr.push(arr.slice(i, i + size));
      return chunkedArr;
    };

    const filteredData = brothers.filter(item => item.firstName.toLowerCase().includes(criteria.toLowerCase()) 
    || item.lastName.toLowerCase().includes(criteria.toLowerCase())
    || item.positions.some(pos => pos.title.toLowerCase().includes(criteria.toLowerCase())));

    const chapter = chunk(filteredData, 4);

    const renderBrother = brother => {
      const name = `${brother.firstName} ${brother.lastName}`;
      const img = `/images/profilePics/${brother.memberId}.jpg`;
      const positionsElements = brother.positions.map((position, index, array) => (
        <Fragment key={index}>
            {position.title}{index < array.length - 1 && <br />}
        </Fragment>
      ));
        
      return (
        <div key={brother.memberId} className="card">
          <img src={img} alt={name} className="profilePic"/>
          <p>{name}</p>
          <p style={{fontWeight: 'bold', fontSize: 'smaller'}}>{positionsElements}</p>
        </div>
      );
    };

    return (
      <tbody>
        {chapter.map((row, index) => 
          <tr key={index} style={{height: 'fit-content', verticalAlign: 'top'}}>
            {row.map((item, idx) => <td>{renderBrother(item)}</td>)}
            {row.length < 4 && new Array(4 - row.length).fill(null).map((_, idx) => <td></td>)}
          </tr>
        )}
      </tbody>
    );
  }

  return (
    <div className="dirContainer">
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
      <table>
        {renderChapter()}
      </table>
      }
      {(!isLoading && error !== '') && <h4 style={{color: 'red'}}>{error}</h4>}
    </div>
  );
}

export default Directory;