package misc

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Header struct {
	Alg string
	Typ string
}
type Payload struct {
	Iss string
	Exp int64
	Jti int
}

func SetCookies(w http.ResponseWriter, id int) {
	secretKey, _ := hex.DecodeString("9d4eace8a07632ede8235878dd7eaa399b0e1bc4163307c8067f9c039b2efb5c") //zamenit
	fmt.Println(secretKey)
	header, _ := json.Marshal(Header{"HS256", "JWT"})
	payload, _ := json.Marshal(Payload{"UIRS", (time.Now().Unix() + 1000), id})
	unsigned := base64.StdEncoding.EncodeToString(header) + "." + base64.StdEncoding.EncodeToString(payload)
	signer := hmac.New(sha256.New, secretKey)
	signer.Write([]byte(unsigned))
	sign := base64.StdEncoding.EncodeToString(signer.Sum(nil))
	token := unsigned + "." + sign
	fmt.Println(token)
	cookie := http.Cookie{
		Name:     "Auth",
		Value:    token,
		MaxAge:   1000,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)
	cookie = http.Cookie{
		Name:   "Authver",
		Value:  "",
		MaxAge: 1000,
	}
	http.SetCookie(w, &cookie)
}
