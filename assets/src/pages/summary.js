import React from "react";

import FillSumm from '../pages/fillSumm';
import Navbar from "../components/Navbar";
import '../styles.css'
import { useNavigate } from "react-router-dom";

function Summary(){
    const [params, setParamsum] = React.useState({Date: '', Transactions: []})
    const route = useNavigate()

    function fetchData(date){
        console.log(date)
        setParamsum({...params, Date: date})
        let date_arr = date.split('-')
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Year: Number(date_arr[0]),
                Month: Number(date_arr[1])
            })
        }
       fetch('http://localhost:3000/summary', options)
       .then(async response =>{
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            let pos = document.cookie.indexOf("Authver=")
            if ((pos===-1)){
                route("/login")
                return Promise.reject("Auth failed")
            }
            setParamsum({Date: date, Transactions: data})
            console.log(params)
       }).catch( error => {
            console.error('ERROR ON SUMM', error)
       })
    }

    return(
        <React.Fragment>
            <Navbar />
            <div>
                <input type='month' value={params.Date} onChange={ event => {fetchData(event.target.value)}} />
                <br />
                <FillSumm transacts={params.Transactions} date={params.Date} />
            </div>
        </React.Fragment>
    )
}

export default Summary