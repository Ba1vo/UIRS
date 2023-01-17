package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func InsertUser(Creds misc.Credentials) int {
	var id int
	db, err := sql.Open("postgres", PsqlInfo) //insert hash code
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(Creds)
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}
	query := fmt.Sprintf(`INSERT INTO public."Accounts" (
		"Name", "Password")
		VALUES ('%s', '%s') RETURNING "ID";`, Creds.Nickname, Creds.Password) //CHECK
	row, err := db.Query(query)
	if err != nil {
		fmt.Println(err.Error())
		return -1
	}
	defer row.Close()
	if row.Next() {
		row.Scan(&id)
		return id
	} else {
		return -1
	}

	/*_, err = db.Exec(query)
	if err != nil {
		fmt.Println(err.Error())
		return -1
	} else {
		return
	}*/
}
