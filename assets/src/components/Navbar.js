import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar(){
    const [params, setParams] = React.useState(false)
    const route = useNavigate() //add exit on button, prob need an server response

    function Exit(){
        
        const toggle = () => {
            setParams(!params);
        };

        function LogOut(){
            sessionStorage.removeItem("user")
            route("/login")
        }

        return(
            <React.Fragment>
                <button type="button" className="collapsible" onClick={toggle}></button> 
                {params && 
                <div className="content exit"> 
                    <button type="button" className="exit" onClick={() => LogOut()}>Выход</button> 
                </div>}
            </React.Fragment>
        )
    }
    
    //style="margin-left: auto;"
    return(
        <React.Fragment>
        <div className="header">
            Семейные расходы
            <div className="navigation">
                <span className="nick_outp"> {sessionStorage.getItem('user')} </span>
                <Exit />
            </div>
        <br />
        <span className="nav_button" onClick={() => route('/summary')}> Summary </span>
        <span className="nav_button" onClick={() => route('/charts')}> Charts </span>
        <div>
        </div>
      </div>
      </React.Fragment>
    )

}

export default Navbar