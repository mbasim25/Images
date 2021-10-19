# Images
A small service that processes images into different sizes and performs extra CRUD operations

# Main Tools and packages

1. Typescript
2. Express
3. PG(node-postgres)
4. Multer
5. Sharp
6. Express-validator

# Links
- [Postman Collection]
- [Heroku]

# How to run the app
- Start by downloading or cloning the project. 
- Add the env variables as shown in the .env_example. 
- Run **npm i** to install all the necessary dependencies.

# Commands 
a list of all the available commands
- **npm run dev** : start the server.
- **npm run build** : compile to js.
- **npm run migrate** : creates the images table.
- **npm start** : start the server after compiling to js.

**PS**: the migrate command also removes all rows from the db table this was added to avoid any issues that stem from saving images on heroku.

[Postman Collection]: https://www.postman.com/gold-crater-470694/workspace/images/documentation/15875859-dece5308-d456-4f0d-b4ed-043c44acd066

[Heroku]: https://images-app-test.herokuapp.com/
