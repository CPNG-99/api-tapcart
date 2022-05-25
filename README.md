# API - TapCard

![main](https://github.com/CPNG-99/api-tapcart/actions/workflows/deploy.yml/badge.svg?branch=master)

Api for TapCard mobile application

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

## Authentications

---

### - Register

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
  "store_description": "store description"
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

### - Login

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
    "access_token": "O1ePdqJk5E9KE+H0BuAz54+e5hfcOUkG0xy5qJZ7dKQ=",
    "refresh_token": "rh6+nWqsV8g0zeYTwH4NsOvz/5rNoQVUtOg589+HbhY="
  }
}
```

### - Get User (Store) Info

- Method : `GET`
- Endpoint : `/api/v1/info`
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
    "email": "johndoe@gmail.com",
    "store_name": "store name",
    "store_address": "store address",
    "store_description": "store description",
    "qr_code": "data:image/png;base64"
  }
}
```

## Store

---

### - Get Store List

- Method : `GET`
- Endpoint : `/api/v1/stores?query=<store_name>`
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
      "store_id": "store id",
      "store_name": "store name",
      "store_address": "store address"
    },
    {
      "store_id": "store id",
      "store_name": "store name",
      "store_address": "store address"
    }
  ]
}
```

### - Get Store Detail

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
    "store_description": "store description",
    "qr_code": "data:image/png;base64"
  }
}
```

### - Update Store

- Method : `PUT`
- Endpoint : `/api/v1/stores/<store_id>`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "store_name": "store name",
  "store_address": "store address",
  "store_description": "store description"
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

### - Get Product List

- Method : `GET`
- Endpoint : `/api/v1/products?store_id=<store_id>&query=<product_name>`
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
      "description": "description",
      "image": {
        "data": [10, 26, 83],
        "content_type": "image/png"
      },
      "price": 20000,
      "stock": 100
    },
    {
      "product_id": "product id",
      "product_name": "product name",
      "description": "description",
      "image": {
        "data": [10, 26, 83],
        "content_type": "image/png"
      },
      "price": 20000,
      "stock": 100
    }
  ]
}
```

### - Add Product

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
  "description": "description",
  "image": {
    "data": [10, 26, 83],
    "content_type": "image/png"
  },
  "price": 20000,
  "stock": 100
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

### - Update Product

- Method : `PUT`
- Endpoint : `/api/v1/products`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "product_id": "product id",
  "product_name": "product name",
  "description": "description",
  "image": {
    "data": [10, 26, 83],
    "content_type": "image/png"
  },
  "price": 20000,
  "stock": 100
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

### - Delete Product

- Method : `DELETE`
- Endpoint : `/api/v1/products`
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

### - Checkout Purchases

- Method : `POST`
- Endpoint : `/api/v1/purchases?store_id=<store_id>`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- body :

```json
{
  "product_id": ["product id", "product id"]
}
```

- response :

```json
{
  "message": "Success",
  "code": 201,
  "error": "",
  "data": {
    "purchase_id": "purchase id",
    "qr_code": "data:image/png;base64"
  }
}
```

### - Cancel Purchase

- Method : `PUT`
- Endpoint : `/api/v1/purchases?store_id=<store_id>`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
- body :

```json
{
  "purchase_id": "purchase id"
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

### - Finish Purchase

- Method : `POST`
- Endpoint : `/api/v1/purchases`
- Header :
  - Content-Type : `application/json`
  - Accept : `application/json`
  - Authorization: `Bearer <access_token>`
- body :

```json
{
  "purchase_id": "purchase id"
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
