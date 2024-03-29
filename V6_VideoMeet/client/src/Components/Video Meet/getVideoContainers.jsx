import React from 'react';

import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';

import MultiUsersCard from './getMultiUsersCard';
import DualVideoCards from './getDualVideoCards';
import SocketConfig from '../../socket';


const GetVideoContainers = () => {

    const { globalState } = useGlobalState();

    const handleVideoContainers = () => {

        switch (globalState.existingUsers) {
            case 1:
                return <DualVideoCards small={false}/>
            case 2:
                return (<>
                    <DualVideoCards small={false}/>
                    <DualVideoCards small={true}/>
                </>
                )
            default:
                return <MultiUsersCard />;
        }

    }

    return (
        <Wrapper>
            {/* {handleVideoContainers()} */}
             <MultiUsersCard />
            <SocketConfig/>
        </Wrapper>
    );
}

export default GetVideoContainers;

const Wrapper = styled.div`
position:absolute;
inset: 16px 16px 80px;
box-sizing:border-box;
display:grid;
justify-items: center;
align-items: center;



`;
