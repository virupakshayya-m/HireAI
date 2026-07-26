import { Outlet } from "react-router-dom";

function CandidateLayout() {
    return (
        <>
            <h2>Candidate Sidebar</h2>

            <Outlet />
        </>
    );
}

export default CandidateLayout;