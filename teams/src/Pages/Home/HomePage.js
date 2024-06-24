import NavbarComponent from "../../Components/NavbarComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebase";

function HomePage(){
  const navigate = useNavigate();
  const [myuid, setMyUid] = useState('');
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if(currentUser){
        setMyUid(currentUser.uid)
      }
      return () => unsubscribe();
    })
  }, []);

  return(
    <div className="home-container">
      <NavbarComponent />
      <div className="home-content">
        <div className="content-menu">
          아직 준비중입니다. home page
        </div>
        <div className="content-inner">
        </div>
      </div>

    </div>
  )
}
export default HomePage;