package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func Add_Transaction(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.Transact_full
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("whoops1")
		return
	}
	if misc.CheckSign(r.Cookies(), &id) {
		w.WriteHeader(http.StatusTeapot)
		return
	}
	misc.SetCookies(w, id)
	if !(regchecks.Check_Date(d.Date) && regchecks.Check_Parameters(d.Param)) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("whoops")
		return
	}
	//id = queries.Auth(regchecks.Inject_Creds(d.Creds))
	switch id { //switch is useless too
	case -1: //not found
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	case -2: //error
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	default:
		fmt.Println("succ")
		d.Param = regchecks.Inject_Transaction(d.Param)
		kolvo := queries.InsertTransaction(id, d)
		if kolvo == -1 {
			w.WriteHeader(http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusNoContent)
		}
	}
}
