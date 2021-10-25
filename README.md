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

# Initializing
- Start by downloading or cloning the project. 
- Add the env variables as shown in the .env_example. 
- Run **npm i** to install all the necessary dependencies.

# Running the app
### 1. docker-compose :
  - Delete the DATABASE_URL from the .env file.
  - Run **npm run dev** inside the terminal.

### 2. Without docker-compose :
  - Run **npm run migrate** inside the terminal.
  - Run **npm run dev** inside the terminal

# Commands 
a list of all the available commands
- **npm run dev** : start the server.
- **npm run build** : compile to js.
- **npm run migrate** : creates the images table.
- **npm start** : start the server after compiling to js.
- **npm run test**: run all test suits.

**PS**: the migrate command also removes all rows from the db table this was added to avoid any issues that stem from saving images on heroku.

[Postman Collection]: https://www.postman.com/gold-crater-470694/workspace/images/documentation/15875859-dece5308-d456-4f0d-b4ed-043c44acd066

[Heroku]: https://images-app-test.herokuapp.com/
