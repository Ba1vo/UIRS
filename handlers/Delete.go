package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
)

func Delete_Transaction(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.Transact_ID
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if misc.CheckSign(r.Cookies(), &id) {
		w.WriteHeader(http.StatusTeapot)
		return
	}
	misc.SetCookies(w, id)
	//id = queries.Auth(d.Creds)
	switch id {
	case -1: //not found
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	case -2: //error
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	default:
		fmt.Println("succ")
		kolvo := queries.DeleteTransaction(id, d)
		switch kolvo {
		case -1:
			w.WriteHeader(http.StatusInternalServerError)
			return
		case 0:
			return //no such trnsct
		default:
			w.WriteHeader(http.StatusNoContent)
			fmt.Println("deleted")
			return
		}
	}
}
