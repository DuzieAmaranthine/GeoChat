import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Room } from "../home/room";

export const Header =({ logout, home }) => {
  const navigate = useNavigate();
  return(
    <div className="header">
      <h1 className="title">GeoChats</h1>
      <h2 className="coordTag">Why talk to the people nearby when you can just chat them virtually?</h2>
      <div className="exit-div">
        <button onClick={logout} className="exit-home">logout</button>
        <Link to={'/'}><button className="exit-home">home</button></Link>
      </div>
    </div>
  )
}