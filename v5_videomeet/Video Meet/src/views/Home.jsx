import React from 'react'
import { Link } from "react-router-dom";
import ShowZeroBadge from '../Components/tempBadge';


const Home = () => {
    return (
        <>
          <div id="sidebar">
            {/* other elements */}
            <nav>
              <ul>
                <li>
                  <Link to={`Stream/`}>Stream</Link>
                </li>
                <li>
                  <Link to={`userConfig/`}>userConfig</Link>
                </li>
              </ul>
            </nav>
            <ShowZeroBadge/>
            {/* other elements */}
          </div>
        </>
      );
}

export default Home