package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func UpdateTransaction(id int, New_tr misc.Transact_full, Old_tr int) int64 {
	db, err := sql.Open("postgres", PsqlInfo)
	if err != nil {
		fmt.Println(err.Error())
		return -1
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return -1
	}
	var sql_insert1 string
	if New_tr.Param.Categorie == "" {
		sql_insert1 = "NULL"
	} else {
		sql_insert1 = "'" + New_tr.Param.Categorie + "'"
	}
	query := fmt.Sprintf(`UPDATE "Transactions" AS a
	SET "Name"='%s', "Categorie"= %s, "Amount"=%s, "Year"=%d, "Month"=%d
	WHERE a."Acc_ID" = %d AND a."ID"= %d;`,
		New_tr.Param.Name, sql_insert1, New_tr.Param.Amount, New_tr.Date.Year, New_tr.Date.Month, id, Old_tr)
	fmt.Println(query)
	res, err := db.Exec(query)
	kolvo, _ := res.RowsAffected()
	if err != nil {
		fmt.Println(err.Error())
		return -1
	} else {
		return kolvo
	}
}
