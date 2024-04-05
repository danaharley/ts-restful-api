# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "dana_harley",
  "password" : "secure_password",
  "name" : "Dana Harliansyah"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "dana_harley",
    "name" : "Dana Harliansyah"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username is required, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "dana_harley",
  "password" : "secure_password"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "dana_harley",
    "name" : "Dana Harliansyah",
    "token" : "uuid"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Invalid Credentials, ..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "dana_harley",
    "name" : "Dana Harliansyah"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "password" : "secure_password", // tidak wajib
  "name" : "Dana Harliansyah" // tidak wajib
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "dana_harley",
    "name" : "Dana Harliansyah"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```