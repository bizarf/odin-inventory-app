# The Odin Project - Project: Inventory app

The goal of this project is to make an inventory management app. This will demonstrate an understand of the knowledge gained from the MDN express local library tutorial.

[View the live site here](https://odin-inventory-app.onrender.com/store)

#### Install:

To run this project on your local server, first install the dependencies with the command:

```
npm install
```

Next you will need to create a ".env" file at the root of the project. You will now need to create a database on MongoDB Atlas. Inside the ".env" file replace the end string with your database's connection string.

```
MONGODB_URL="AMONGODBATLASKEY"
```

After that is done, you can start the server with:

```
npm start
```

<hr>

##### Tools and technologies used:

-   Express Generator
-   Pug
-   Dotenv
-   Mongoose
