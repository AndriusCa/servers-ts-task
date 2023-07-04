# Vartotojų API - CRUD

-   git/Github/readme (1pt)
    -   git - kiekvienas prasmingas pakeitimas atskirame commit'e;
    -   readme - su pavyzdžiais kaip naudotis jūsų API ir kartu pateikti pavyzdinius gražinamus rezultatus;
-   nuorodos struktūra `/api/user` (1pt);
-   visos kitos nuorodos gražina `404` (1pt);
-   sukurti elementą `POST: /api/user` (1pt);
    -   kuriant elementą pridėti įrašymo datą ir unikalų ID (1pt);
    -   JSON išsaugoti kaip failą;
-   gauti elemento informaciją `GET: /api/user/[ID]` (1pt);
    -   password negalima gražinti;
-   gauti elemento informaciją `GET: /api/user-by-email/[EMAIL]` (1pt);
    -   password negalima gražinti;
-   atnaujinti elementą `PUT: /api/user` (1pt);
-   atnaujinti elementą `PUT: /api/user-email` (1pt);
-   ištrinti elementą `DELETE: /api/user/[ID]` (1pt);

## How to use

> **POST: /api/user**

Request object:

```json
{
    "name": "petas",
    "email": "petras@petraitis.lt",
    "password": "slaptasslaptazodis",
    "age": 99
}
```

Response object, if all goes well:

```json
{
    "message": "User created"
}
```

Response object, if any error:

```json
{
    "message": "Error: EEXIST: file already exists"
}
```

> **DELETE: /api/user**

Response object, if all goes well:

```json
{
    "message": "User deleted"
}
```

Response object, if any error:

```json
{
    "message": "Error: ENOENT: no such file or directory"
}
```


> **PUT: /api/user**

Response object, if all goes well:

```json
{
    "message": "User updated"
}
```


> **GET: /api/user-by-email/[EMAIL]**

Response object, if all goes well:

```json
{
    "name": "petas",
    "email": "petras@petraitis.lt",
    "password": "slaptasslaptazodis",
    "age": 99
}
```

Response object, if any error:

```json
{
    "message": "Failas nerastas"
}
```
