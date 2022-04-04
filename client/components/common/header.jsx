import { useNavigate } from "react-router";
import { Room } from "../home/room";

export const Header =({ logout, name }) => {
  const navigate = useNavigate();
  return(
    <div className="header">
      <h1 className="title">GeoChat</h1>
      <h2 className="coordTag">Why talk to the people nearby when you can just chat them virtually?</h2>
      <div className="exit-div">
        <button onClick={logout} className="exit">logout</button>
      </div>
    </div>
  )
}