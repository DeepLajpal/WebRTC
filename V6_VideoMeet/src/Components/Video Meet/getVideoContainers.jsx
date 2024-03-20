import React from 'react';

import styled from 'styled-components';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';

import MultiUsersCard from './getMultiUsersCard';
import DualVideoCards from './getDualVideoCards';


const GetVideoContainers = ({ small }) => {

    const { globalState } = useGlobalState();

    return (
        <Wrapper>
            {globalState.existingUsers <= 2 && (
                <>
                    <DualVideoCards small={false} />
                    <DualVideoCards small={true} />
                </>
            )}
            {globalState.existingUsers > 2 && <MultiUsersCard />}
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
