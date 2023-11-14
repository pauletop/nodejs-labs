## Lab-09-RESTful-API
### About the lab
This laboratory is about the implementation of a simple Rest API server to manage users, accounts and transactions. <br>
The server is implemented using the Flask framework and the data is stored in a SQLite database. The server is able to handle the following requests:
- POST /api/account/register
- POST /api/account/login
- GET /api/products
- GET /api/products/<id>
- <strong>POST</strong> /api/products
- <strong>PUT</strong> /api/products/<id>
- <strong>DELETE</strong> /api/products/<id>
- <strong>GET</strong> /api/orders
- <strong>POST</strong> /api/orders
- <strong>GET</strong> /api/orders/<id>
- <strong>PUT</strong> /api/orders/<id>
- <strong>DELETE</strong> /api/orders/<id>
Where the <strong>bold</strong> methods are the ones that need login and authentication to be executed. <br>
The server is also able to handle the following errors:
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 405 Method Not Allowed
- 409 Conflict
- 500 Internal Server Error
### How to run the server
To run the server you need to install all the dependencies listed in the package.json file. To do so, you can run the following command:
```bash
npm install
```
Then, you can run the server with the following command:
```bash
npm start
```
It will start the server on the port 3000 by default. Really easy, isn't it? <br>
### About models construction
There are three models in this laboratory: account, product and order. <br>
#### The account model is composed by the following fields:
- name: the name of the user
- email: the email of the user
- password: the password of the user
- token: the token, which will be used for authentication purposes is returned by the server when the user logs in.
#### The product model is composed by the following fields:
- code: the product code
- name: the product name
- price: the product price
- image?: the product image (optional)
- description?: the product description (optional)
#### The order model is composed by the following fields:
- code: the order code
- total: the total amount of the order
- products: the list of products of the order
    ## Note that:
     I store product as an object in the products list field. This is because I want to store more information about the product, not only the code which more convenient for the user. So, if you want easily to use, add products to the list just via the code, you must add some steps before or edit the code.