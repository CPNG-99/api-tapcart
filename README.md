# API - TapCard

![main](https://github.com/CPNG-99/api-tapcart/actions/workflows/deploy.yml/badge.svg?branch=master)

API for TapCard mobile application

## - Development

To simplified development you need to have `yarn` or `npm`, `Docker` and `Docker Compose` (optional) installed on your machine. Then run these command to install dependencies, running local database, and start development server :

```sh
yarn
docker-compose up -d
```

or if you're using npm

```sh
npm install
docker-compose up -d
```

if you wish to use nodemon during development you can run the `mongo` service only, and then run the local server with `yarn` or `npm`.

```sh
yarn dev
```

or

```sh
npm run dev
```

---

## - Deployment

Just push to `master` branch, `Github Actions` will take care the delpoyment.

---

## - API Spec

✅ -> Implemented\
❌ -> Unimplemented

## Authentications

---

### - Register ✅

- Method : `POST`
- Endpoint : `/auth/v1/register`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- body :

```json
{
  "email": "johndoe@gmail.com",
  "password": "password",
  "store_name": "store name",
  "store_address": "store address",
  "open_hours": "07.00 - 20.00"
}
```

- response :

```json
{
  "message": "Success",
  "code": 201,
  "error": "",
  "data": {
    "qr_code": "data:image/png;base64"
  }
}
```

### - Login ✅

- Method : `POST`
- Endpoint : `/auth/v1/login`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- body :

```json
{
  "email": "johndoe@gmail.com",
  "password": "password"
}
```

- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": {
    "access_token": "O1ePdqJk5E9KE+H0BuAz54+e5hfcOUkG0xy5qJZ7dKQ="
  }
}
```

### - Get User (Store) Info ✅

- Method : `GET`
- Endpoint : `/api/v1/users`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": {
    "store_id": "store id",
    "store_name": "store name",
    "store_address": "store address",
    "open_hours": "07.00 - 20.00",
    "qr_code": "data:image/png;base64"
  }
}
```

## Store

---

### - Get Store Detail ✅

- Method : `GET`
- Endpoint : `/api/v1/stores/<store_id>`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": {
    "store_id": "store id",
    "store_name": "store name",
    "store_address": "store address",
    "open_hours": "07.00 - 20.00",
    "qr_code": "data:image/png;base64"
  }
}
```

### - Update Store ❌

- Method : `PUT`
- Endpoint : `/api/v1/stores`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "store_name": "store name",
  "store_address": "store address",
  "open_hours": "07.00 - 20.00"
}
```

- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": null
}
```

## Products

---

### - Get Product List ✅

- Method : `GET`
- Endpoint : `/api/v1/products?store_id=<store_id>`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": [
    {
      "product_id": "product id",
      "product_name": "product name",
      "image": "data:image/png;base64",
      "price": 20000,
      "is_available": true,
      "store_id": "store id"
    },
    {
      "product_id": "product id",
      "product_name": "product name",
      "image": "data:image/png;base64",
      "price": 20000,
      "is_available": true,
      "store_id": "store id"
    }
  ]
}
```

### - Add Product ✅

- Method : `POST`
- Endpoint : `/api/v1/products`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "product_name": "product name",
  "image": "data:image/png;base64",
  "price": 20000,
  "is_available": true,
  "store_id": "store id"
}
```

- response :

```json
{
  "message": "Success",
  "code": 201,
  "error": "",
  "data": null
}
```

### - Update Product ❌

- Method : `PUT`
- Endpoint : `/api/v1/products/:product_id`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "product_name": "product name",
  "image": "data:image/png;base64",
  "price": 20000,
  "is_available": true
}
```

- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": null
}
```

### - Delete Product ✅

- Method : `DELETE`
- Endpoint : `/api/v1/products/:product_id`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": null
}
```

## Purchases

---

### - Checkout Purchases ✅

- Method : `POST`
- Endpoint : `/api/v1/purchases`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- body :

```json
{
  "products": [
    {
      "quantity": 2,
      "product_id": "product id"
    },
    {
      "quantity": 2,
      "product_id": "product id"
    }
  ]
}
```

- response :

```json
{
  "message": "Success",
  "code": 201,
  "error": "",
  "data": {
    "purchase_id": "purchase_id",
    "qr_code": "data:image/png;base64"
  }
}
```

### - Cancel Purchase ✅

- Method : `DELETE`
- Endpoint : `/api/v1/purchases/:purchase_id`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": null
}
```

### - Get Purchase Item (Store Checkout) ✅

- Method : `GET`
- Endpoint : `/api/v1/purchases/:purchase_id`
- Header :

  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`

- response :

```json
{
  "message": "Success",
  "code": 200,
  "error": "",
  "data": {
    "total_price": 40000,
    "items": [
      {
        "quantity": 2,
        "product_name": "product name",
        "image": "data:image/png;base64",
        "price": 20000,
        "is_available": true
      },
      {
        "quantity": 2,
        "product_name": "product name",
        "image": "data:image/png;base64",
        "price": 20000,
        "is_available": true
      }
    ]
  }
}
```
