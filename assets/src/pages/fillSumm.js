import React from "react";
import '../styles.css'
import AddTransact from "./add_dial"
import RedactTransact from "./redact_dial"

function FillSumm(transacts){
    
    function FillCat({ transactions }) {
        const [params, setParamsum] = React.useState(false)

        console.log(transactions)
        if (transactions.length < 1){
            return
        }
        let cat_arr = []
        let start, end = 0
        let curr_categor = transactions[0].Categorie;
        let curr_total = 0
        transactions.forEach(element => {
            if (element.Categorie != curr_categor){
                let cat_total = transactions.slice(start, end)
                cat_arr.push({tr_array: cat_total, total: curr_total})
                start = end
                curr_total = 0;
                curr_categor = element.Categorie
            }
            curr_total += Number(element.Amount)
            end+=1
        });
        cat_arr.push({tr_array: transactions.slice(start, transactions.length), total: curr_total})
        console.log('Cat_arr', cat_arr)

        const toggle = () => {
            setParamsum(!params);
        };
          

        return(
            <React.Fragment>
                <button type="button" className ="collapsible" onClick={toggle}> </button>
                {params && <div className ="content" id="expenses_detail">
                    Категории: <br/>
                     {cat_arr.map((obj, i)=> <MakeCat array={obj} key={i} /> )} 
                </div>}
            </React.Fragment>
        )

    }

    function MakeCat( {array} ){
        const [params, setParamCat] = React.useState(false)

        console.log("eto obj: ", array)
        if (array.tr_array[0].Categorie === ''){
            return(
                <div>
                    Транзакции без категорий
                    {
                    array.tr_array.map( transact => {
                        return <RedactTransact transact={transact} key={transact.ID} />
                    })
                    } 
                </div>
            )
        }

        const toggle = () => {
            setParamCat(!params);
        };

        return(
            <React.Fragment>
                <span className="categorie">  {array.tr_array[0].Categorie+ ": "+ array.total.toFixed(2)} 
                <button type="button" className ="collapsible" onClick={toggle}></button>
                {params &&  
                <div className ="content"> {"Переводы категории " + array.tr_array[0].Categorie} 
                {
                    array.tr_array.map( transact => {
                        return <RedactTransact transact={transact} key={transact.ID} date={transacts.date} />
                    })
                } 
                </div>} 
                </span> 
                <br />
            </React.Fragment>
        )
    }

    let index = 0
    let income = 0
    let expenses = 0
    for (let i = 0; i < transacts.transacts.length; i++) {
        let transact = transacts.transacts[i]
        if(Number(transact.Amount) > 0) {
            index +=1;
            income += Number(transact.Amount)
        } else {
            expenses += Number(transact.Amount)
        }
    }
    let surplus = income + expenses
    console.log(surplus)
    surplus.toFixed(2)
    let arr1 = []
    let arr2 = []
    console.log(transacts)
    if(transacts.transacts) {
        arr1 = transacts.transacts.slice(0, index)
        arr2 = transacts.transacts.slice(index, transacts.transacts.length)
    }

    return(
        <React.Fragment>
            <div id="SumBox">
                    <table id="SumTable">
                        <tbody>
                            <tr>
                                <td className = "firstcol">Доходы</td>
                                <td className = "seccol" id="total_income">
                                    {"Всего "+ income.toFixed(2)}
                                    {<FillCat transactions={arr1} date={transacts.date} />}
                                    <br />
                                    <AddTransact sign=''/>
                                </td>
                            </tr>
                            <tr id="middlerow">
                                <td className="firstcol">Расходы</td>
                                <td id="total_expenses">
                                    {"Всего "+ expenses.toFixed(2)}
                                    {<FillCat transactions={arr2} idName = {"expenses_detail"} />}
                                    <br />
                                    <AddTransact sign='-' date={transacts.date}/>
                                </td>
                            </tr>
                            <tr>
                                <td className ="firstcol">Итог</td>
                                <td id="Surplus"> {surplus.toFixed(2)} </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </React.Fragment>
    )
}

export default FillSumm