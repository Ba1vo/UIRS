import React from "react";
import '../styles.css'

function AddTransact(prop){
    const [addpar, setAdd] = React.useState({Name: '', Categorie: '', Amount: prop.sign, Date: prop.date, Toggle: false})

    const toggle = () => {
        setAdd({...addpar, Toggle: !addpar.Toggle});
        console.log(addpar)
    };

    function CheckTransact(){
        return true
    }

    function HandleSubmit(event){
        event.preventDefault()
        let date_arr = addpar.Date.split('-')
        if ( !CheckTransact() ){
            console.log("shit value")
            return
        }  //display smth
       let requestOptions  = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Param: {
                    Name: addpar.Name,
                    Categorie: addpar.Categorie,
                    Amount: addpar.Amount
                },
                Date: {
                    Month: Number(date_arr[1]),
                    Year: Number(date_arr[0])
                }
            })
       }
       fetch('http://localhost:3000/add', requestOptions)
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
            setAdd({Name: '', Categorie: '', Amount: prop.sign, Date: '', Toggle: false})
       }).catch( error => {
            setAdd({Name: '', Categorie: '', Amount: prop.sign, Date: '', Toggle: false})
            console.error('ERROR ON LOGIN', error)
       }
       ) //if error set AuthErr true, else route(Summary)
    }
    
    return(
        <React.Fragment>
            <button type="button" onClick={toggle}>Добавить доход</button>
            {addpar.Toggle && 
            <div id="blur">
                <div id="add_dial">
                    <form onSubmit={HandleSubmit}>
                        <div id="addpage_name"> Добавить перевод  </div>
                        <div className="input_div">
                            Название перевода
                            <input type="text" className ="br_input" id="tr_name" value={addpar.Name} onChange={event => setAdd({...addpar, Name: event.target.value})} />
                        </div>
                        <div className="input_div">
                            Категория
                            <input type="text" className="br_input" id="tr_categorie" value={addpar.Categorie} onChange={event => setAdd({...addpar, Categorie: event.target.value})} />
                        </div>
                        <div className="input_div">
                            Количество
                            <input type="text" className="br_input" id="tr_amount" value={addpar.Amount} onChange={event => setAdd({...addpar, Amount: event.target.value})} /> 
                        </div>
                        <div className="input_div">
                            Дата
                            <input className="br_input" id="tr_date" type="month" min="2010-03" value={addpar.Date} onInput={event => setAdd({...addpar, Date: event.target.value})} />
                        </div>
                        <button type="submit" id="add_tr_btn"> Добавить </button>
                    </form> 
                    <button type="button" onClick={() => setAdd({...addpar, Toggle: false})}> Выйти </button>
                </div>
            </div>
            }
        </React.Fragment>
    )
}

export default AddTransact