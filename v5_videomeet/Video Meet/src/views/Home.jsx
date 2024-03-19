import React from 'react'
import { Link } from "react-router-dom";
import MultiUsersCard from '../Components/multiUsersCard';
import VideoCallLayout from '../Components/tempMultiUserCard';


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
            <MultiUsersCard/>
            {/* <VideoCallLayout/> */}
            {/* other elements */}
          </div>
        </>
      );
}

export default Home