import { lazy, Suspense } from "react";

const committeeMap = {
    'Bylaws Committee': {
        Chairman: lazy(() => import('./GP/Bylaws/chairman')),
        Committee: lazy(() => import('./GP/Bylaws/committee'))
    },
    'House Manager': {
        Chairman: lazy(() => import('./GP/HouseManager/chairman')),
        Committee: lazy(() => import('./GP/HouseManager/committee'))
    },
    'Scholarship Committee': {
        Chairman: lazy(() => import('./GP/Scholarship/chairman')),
        Committee: lazy(() => import('./GP/Scholarship/committee'))
    },
    'MHC Committee': {
        Chairman: lazy(() => import('./GP/MHC/chairman')),
        Committee: lazy(() => import('./GP/MHC/committee'))
    },
    "Rush Committee": {
        Chairman: lazy(() => import('./GMC/Rush/chairman')),
        Committee: lazy(() => import('./GMC/Rush/committee'))
    },
    'Brotherhood Committee': {
        Chairman: lazy(() => import('./GMC/Brotherhood/chairman')),
        Committee: lazy(() => import('./GMC/Brotherhood/committee'))
    },
    "History Committee": {
        Chairman: lazy(() => import('./GMC/Historian/chairman')),
        Committee: lazy(() => import('./GMC/Historian/committee'))
    },
    'Pledge Educator': {
        Chairman: lazy(() => import('./GMC/PledgeEducation/chairman')),
        Committee: lazy(() => import('./GMC/PledgeEducation/committee'))
    },
    'Ritual Committee': {
        Chairman: lazy(() => import('./GMC/Ritual/chairman')),
        Committee: lazy(() => import('./GMC/Ritual/committee'))
    },
    'Social Committee': {
        Chairman: lazy(() => import('./GMC/Social/chairman')),
        Committee: lazy(() => import('./GMC/Social/committee'))
    },


    "Public Relations Committee": {
      Chairman: lazy(() => import('./GS/PR/chairman')),
      Committee: lazy(() => import('./GS/PR/committee')),
    },
    "Alumni Relations Committee": {
      Chairman: lazy(() => import('./GS/Alumni/chairman')),
      Committee: lazy(() => import('./GS/Alumni/committee')),
    },
    "Awards Committee": {
      Chairman: lazy(() => import('./GS/Awards/chairman')),
      Committee: lazy(() => import('./GS/Awards/committee')),
    },
    "Intramural Committee": {
      Chairman: lazy(() => import('./GS/Intramurals/chairman')),
      Committee: lazy(() => import('./GS/Intramurals/committee')),
    },


    "Fundraising Committee": {
      Chairman: lazy(() => import('./GT/Fundraising/chairman')),
      Committee: lazy(() => import('./GT/Fundraising/committee')),
    },
    "Philanthropy Committee": {
      Chairman: lazy(() => import('./GT/Philanthropy/chairman')),
      Committee: lazy(() => import('./GT/Philanthropy/committee')),
    },


    "Executive Committee": {
      'Grand Master': lazy(() => import('./GM/gm')),
      'Grand Procurator': lazy(() => import('./GP/gp')),
      'Grand Master of Ceremonies': lazy(() => import('./GMC/gmc')),
      'Grand Treasurer': lazy(() => import('./GT/gt')),
      'Grand Scribe': lazy(() => import('./GS/gs')),
    },

    "Assistant Grand Treasurer": {
      Chairman: lazy(() => import('./GT/agt'))
    },
    "Assistant Grand Scribe": {
      Chairman: lazy(() => import('./GS/ags'))
    },
    Guard: {
      Chairman: lazy(() => import('./GP/guard'))
    }
};

const CommitteePosition = ({ position }) => {
    const Component = committeeMap[position.committeeName][position.role];
  
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {Component ? <Component /> : <div>Component not found</div>}
      </Suspense>
    );
};

export default CommitteePosition;