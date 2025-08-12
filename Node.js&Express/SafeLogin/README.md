# Authentication API

This is a Node.js and Express-based authentication system that uses SQLite for data storage.  
It provides APIs for user registration, login, and password change.

---

## Features
- User Registration with validation
- User Login with password check
- Change Password with validation
- SQLite database (userData.db) for storing user details

---

## Technologies Used
- *Node.js* (JavaScript runtime)
- *Express.js* (Web framework)
- *SQLite* (Database)
- *bcrypt* (Password hashing)
- *Body-parser* (Request parsing)

---

## Installation

1. *Clone the repository*
   bash
   git clone <your-repo-url>
   cd <project-folder>
`

2. *Install dependencies*

   bash
   npm install
   

3. *Add the database*

   * Use the provided userData.db file in the project root.


4. *Run the server*

   bash
   node app.js
   

   Server will run at:

   
   http://localhost:3000
   

---

## API Endpoints

### 1. Register User

*POST* /register

Request:

json
{
  "username": "adam_richard",
  "name": "Adam Richard",
  "password": "richard_567",
  "gender": "male",
  "location": "Detroit"
}


Responses:

* 400: User already exists
* 400: Password is too short
* 200: User created successfully

---

### 2. Login User

*POST* /login

Request:

json
{
  "username": "adam_richard",
  "password": "richard_567"
}


Responses:

* 400: Invalid user
* 400: Invalid password
* 200: Login success!

---

### 3. Change Password

*PUT* /change-password

Request:

json
{
  "username": "adam_richard",
  "oldPassword": "richard_567",
  "newPassword": "richard@123"
}


Responses:

* 400: Invalid current password
* 400: Password is too short
* 200: Password updated

---

## Project Structure


project/
│── app.js         
│── userData.db   
│── package.json   
│── .gitignore     
└── README.md      




