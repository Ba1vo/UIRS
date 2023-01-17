import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css'
 
function Login(){
    const [params, setParams] = React.useState({Login: '', Pass: '', AuthErr: false, First: true})
    const route = useNavigate()

    function HandleClick(event){
        event.preventDefault()
        if ( !CheckCreds() ){
            console.log("shit value")
            return
        }  //display smth
       let requestOptions  = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nickname: params.Login,
                Password: params.Pass
            })
       }
       fetch('http://localhost:3000/login', requestOptions)
       .then(async response =>{
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            let pos = document.cookie.indexOf("Authver=")
            console.log(pos)
            if ((pos===-1)){
                
                return Promise.reject("Auth failed")
            }
            //WHAT TO DO WITH THIS
            sessionStorage.setItem('user', params.Login)
            route('/summary')
       }).catch( error => {
            setParams({...params, AuthErr: true})
            console.error('ERROR ON LOGIN', error)
       }
       ) //if error set AuthErr true, else route(Summary)
    }

    function CheckCreds(){
        let reg_exp = /^(\p{Script=Cyrillic}|\w){5,40}$/u;
        return reg_exp.test(params.Login) && reg_exp.test(params.Pass)
    }

    return(
        <React.Fragment>
            <div className="centered">
                Login
                <form onSubmit={HandleClick}>
                    <input type='text' value={params.Login} onInput={ event => {setParams({...params, Login: event.target.value}); console.log(params) }}/>
                    <input type='text' value={params.Pass} onInput={ event => setParams({...params, Pass: event.target.value})} />
                    <button type="submit"> Войти </button>
                </form>
                <button type="button" onClick={() => route("/reg")}> Перейти к регистрации</button>
            </div>
        </React.Fragment>
    )
}

export default Login