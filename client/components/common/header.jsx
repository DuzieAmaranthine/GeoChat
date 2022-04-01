import { useNavigate } from "react-router";

export const Header =({ logout, roomTitle }) => {
  const navigate = useNavigate();
  return(
    <div className="header">
      <h1 className="title">GeoChat</h1>
      <h2 className="coordTag">Why talk to the people nearby when you can just chat them virtually?</h2>
    </div>
  )
}