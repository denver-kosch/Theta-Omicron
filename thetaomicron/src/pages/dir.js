import React from "react";
import './pagesCSS/dir.css';
import { Link, Outlet } from "react-router-dom";

const Directory = () => {



  return (
    <div className="dirContainer">
      <div className="topBar">
        <div/>
        <div>
          <h1>Brothers Directory:</h1>
        </div>
        <div>
          <Link to="trees" className="famTree">
            <h3>Family Trees</h3>
          </Link>
        </div>
      </div>
      <br/>
      <table>
        <tbody>
          <tr>
            <td>

            </td>
          </tr>
        </tbody>
      </table>

      <Outlet/>
    </div>
);
}

export default Directory;