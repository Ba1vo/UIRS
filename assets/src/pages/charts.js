import React from "react";

import {Chart} from "react-google-charts";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import '../styles.css'


function Charts(){
    const [params, setParams] = React.useState({First_date: '', Sec_date: '', PieData: [], ColData: [], Err: false, First: false})
    const route = useNavigate()

    function Get_Charts(){
        if(params.First_date !== '' && params.Sec_date !== '' && params.First_date < params.Sec_date){
            let dat_arr1 = params.First_date.split('-')
            let dat_arr2 = params.Sec_date.split('-')
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    F_Date: {
                        Month: Number(dat_arr1[1]),
                        Year: Number(dat_arr1[0])
                    },
                    S_Date: {
                        Month: Number(dat_arr2[1]),
                        Year: Number(dat_arr2[0])
                    }
                })
           }
            fetch('http://localhost:3000/charts', options)
            .then(async response =>{
            const isJson = true//response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            console.log('eto data',data)
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            let pos = document.cookie.indexOf("Authver=")
            if (pos===-1){
                route("/login")
                return Promise.reject("Auth failed")
            }
            let temp_data = []
            let Cdata = []
            if(data.Month_Det != null){
                temp_data = [ ['Date', 'Positive', 'Negative'], ];
                for(let i=0; i<data.Month_Det.length; i++ ) {
                    temp_data.push([data.Month_Det[i].Date,Number(data.Month_Det[i].Pos),Number(data.Month_Det[i].Neg)])
                }
                console.log("temp data", temp_data)       
                console.log("kek data", params)  
            }
            if(data.Categorie_Det!= null){
                Cdata = [ ['Categorie', 'Neg'], ];
                for(let i=0; i<data.Categorie_Det.length; i++ ) Cdata.push([data.Categorie_Det[i].Categorie, Number(data.Categorie_Det[i].Sum)])
                console.log("received data", Cdata)
                console.log("received data", params)      
            }
            setParams({...params, PieData: Cdata, ColData: temp_data, First:true})
            console.log("received data", params)
            }).catch( error => {
                setParams({...params, Err: true})
                console.error('ERROR ON LOGIN', error)
            }) 
        }
        console.log("itogo", params)  
    }

    return(
        <React.Fragment>
            <Navbar />
                <input id="first_date" type="month" value={params.First_date} onChange={ event => setParams({...params, First_date: event.target.value}) } />
                <input id="second_date" type="month" value={params.Sec_date} onChange={ event =>  setParams({...params, Sec_date: event.target.value})} /> <br />
                <button id="show_chrt" type="button" onClick={() => Get_Charts()}>Показать графики</button>
                {params.First &&
                <>
                {params.PieData.length > 0 
                        ?
                            <Chart
                            className="chart"
                            chartType="PieChart"
                            data={ params.PieData }
                            options={ {title:'Расходы по категориям'} }/>
                    :   <p> "У вас нет транзакций с категориями за этот промежуток" </p>}
                {params.ColData.length > 0 
                    ?   <Chart
                            className="chart" 
                            chartType="ColumnChart"
                            data={ params.ColData }
                            options={ {title:'Доходы и расходы за промежуток по месяцам'} }
                        />  
                    :   <p> "У вас нет транзакций за этот промежуток" </p>}
                </>    
                }
        </React.Fragment>
    )
}

export default Charts