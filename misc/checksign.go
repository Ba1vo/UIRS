package misc

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

func CheckSign(cookies []*http.Cookie, id *int) bool {
	for _, cookie := range cookies {
		if cookie.Name == "Auth" { //tbh you need to check header for decoding algorithm header, _ := base64.StdEncoding.DecodeString(parts[0])
			secretKey, _ := hex.DecodeString("9d4eace8a07632ede8235878dd7eaa399b0e1bc4163307c8067f9c039b2efb5c") //zamenit
			signer := hmac.New(sha256.New, secretKey)
			token := cookie.Value
			parts := strings.Split(token, ".")
			signer.Write([]byte(parts[0] + "." + parts[1]))
			sign := base64.StdEncoding.EncodeToString(signer.Sum(nil))
			fmt.Println("What server produced", sign)
			fmt.Println("What we got", parts[2])
			if sign != parts[2] {
				return true
			}
			json_str, _ := base64.StdEncoding.DecodeString(parts[1])
			var payload Payload
			json.Unmarshal([]byte(json_str), &payload)
			if payload.Exp >= time.Now().Unix() {
				*id = payload.Jti
				return false
			} else {
				return true
			}
		}
	}
	return true
}
