import { Link } from "react-router-dom";


function NavbarComponent(){
  return(

    <div className="navbar">
<Link to="#none">
  <i className="bi bi-house"></i>
</Link>

<Link to="#none">
  <i className="bi bi-briefcase"></i>
</Link>

<Link to="#none">
  <i className="bi bi-chat-dots"></i>
</Link>

<Link to="/todo">
  <i className="bi bi-check2-circle"></i>
</Link>
<Link to="/profile">
  <i className="bi bi-person"></i>
</Link>

<Link to="#none">
  <i className="bi bi-gear"></i>
</Link>
</div>
  )
}
export default NavbarComponent;