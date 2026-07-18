import { Link } from "react-router-dom";

function Home() {
    return(
        <div>
            <div>
                <Link to="/courses">Courses</Link>
                <Link to="/assignments">Assignments</Link>
            </div>
        </div>
    )
}

export default Home;