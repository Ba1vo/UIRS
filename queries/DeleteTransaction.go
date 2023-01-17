package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func DeleteTransaction(id int, Trnsct misc.Transact_ID) int64 {
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

	query := fmt.Sprintf(`DELETE FROM "Transactions" AS a
	WHERE a."Acc_ID" = %d AND a."ID"=%d ;`,
		id, Trnsct.ID)
	fmt.Println(query)
	res, err := db.Exec(query)
	if err != nil {
		fmt.Println(err.Error()) //w.WriteHeader(http.StatusInternalServerError)
		return -1
	}
	kolvo, _ := res.RowsAffected()
	return kolvo
}
