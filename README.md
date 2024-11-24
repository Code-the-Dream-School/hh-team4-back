# Back-End Repo for Node/React Practicum

This will be the API for the front-end React app part of your practicum project.

These instructions are for the **front-end team** so they can setup their local development environment to run 
both the back-end server and their front-end app. You can go through these steps during your first group meeting 
in case you need assistance from your mentors.

>The back-end server will be running on port 8000. The front-end app will be running on port 3000. You will need to run both the back-end server and the front-end app at the same time to test your app.

### Setting up local development environment

1. Create a folder to contain both the front-end and back-end repos 
2. Clone this repository to that folder
3. Run `npm install` to install dependencies
4. Pull the latest version of the `main` branch (when needed)
5. Run `npm run dev` to start the development server
6. Open http://localhost:8000/api/v1/ with your browser to test.
7. Your back-end server is now running. You can now run the front-end app.

#### Running the back-end server in Visual Studio Code

Note: In the below example, the group's front-end repository was named `bb-practicum-team1-front` and the back-end repository was named `bb-practicum-team-1-back`. Your repository will have a different name, but the rest should look the same.
![vsc running](images/back-end-running-vsc.png)

#### Testing the back-end server API in the browser

![browser server](images/back-end-running-browser.png)

>Update the .node-version file to match the version of Node.js the **team** is using. This is used by Render.com to [deploy the app](https://render.com/docs/node-version).


#### Setting Up the Backend and Testing the Database Connection

1. Make sure you have cloned the backend repo.
2. Run `npm install` to install dependencies
3. In the root of the project, create a .env file with the following content:

    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority

4. Run `npm run dev` to start the backend development server
5. Use the following test route to verify that the database connection is working:
        
    GET /api/v1/test/test-db

#### Troubleshooting: Duplicate Batch Code Error
This means the batchCode value in the test route (testRoutes.js) already exists in the database. MongoDB enforces a unique constraint on the batchCode field to ensure no duplicates.
To fix it, open the testRoutes.js file and update the batchCode field in the test data to a unique string.
Save the file and rerun the server. To prevent this error, ensure that batchCode values in the test data are unique each time you test the application.


---

# **Testing the User Model**

This document provides instructions for testing the **User model**, including creating users, retrieving user details, validating passwords, resetting passwords, and deleting users. The routes provided are part of the testRoutes router. 

---

## **Available Test Routes**

### **1. Create a New User**

- **Endpoint**: `POST /api/v1/test/test-create-user`
- **Description**: Creates a new user in the database.
- **Request Body Example(JSON)**:
  ```json
  {
    "firstName": "John",
    "email": "john.doe@example.com",
    "password": "StrongPassword123",
    "role": "admin",
    "store": "Main Clinic"
  }
  ```
- **Expected Response Example**:
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "firstName": "John",
      "email": "john.doe@example.com",
      "role": "admin",
      "store": "Main Clinic",
      "_id": "6742891fea2350eb11162634",
      "createdAt": "2024-11-24T02:02:07.237Z",
      "updatedAt": "2024-11-24T02:02:07.237Z",
      "__v": 0
    }
  }
  ```

---

### **2. Fetch a User by Email**

- **Endpoint**: `GET /api/v1/test/test-get-user`
- **Description**: Retrieves a user by their email address.
- **Query Parameter**:
  ```
  email=john.doe@example.com
  ```
- **Request Example**:
  ```
  GET http://localhost:8000/api/v1/test/test-get-user?email=john.doe@example.com
  ```
- **Expected Response Example (if user exists)**:
  ```json
  {
    "success": true,
    "data": {
      "firstName": "John",
      "email": "john.doe@example.com",
      "role": "admin",
      "store": "Main Clinic",
      "createdAt": "2024-11-24T02:02:07.237Z",
      "updatedAt": "2024-11-24T02:02:07.237Z",
      "_id": "6742891fea2350eb11162634"
    }
  }
  ```

---

### **3. Validate User Password**

- **Endpoint**: `POST /api/v1/test/test-validate-password`
- **Description**: Validates a user's password against the hashed password stored in the database.
- **Request Body (JSON)**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Expected Response (if password is correct)**:
  ```json
  {
    "success": true,
    "message": "Password is valid"
  }
  ```

---

### **4. Reset User Password**

- **Endpoint**: `POST /api/v1/test/test-reset-password`
- **Description**: Resets a user's password if they provide their current password and a new password.
- **Request Body (JSON)**:
  ```json
  {
    "email": "john.doe@example.com",
    "currentPassword": "StrongPassword123",
    "newPassword": "NewSecurePassword456"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```
- **Error Responses**:
  - **Incorrect Password**:
    ```json
    {
      "success": false,
      "message": "Current password is incorrect"
    }
    ```
  - **User Not Found**:
    ```json
    {
      "success": false,
      "message": "User not found"
    }
    ```

---

### **5. Delete a User**

- **Endpoint**: `DELETE /api/v1/test/test-delete-user/:id`
- **Description**: Deletes a user by their ID.
- **Request Example**:
  ```
  DELETE http://localhost:8000/api/v1/test/test-delete-user/6742891fea2350eb11162634
  ```
- **Expected Response (if user exists)**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```
- **Error Response (if user does not exist)**:
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

## **How to Test Using Postman**

1. **Install Postman**:
   - Download and install [Postman](https://www.postman.com/downloads/) if not already installed.

2. **Create New Requests**:
   - For each route, create a new request in Postman.
   - Configure the method (`POST`, `GET`, or `DELETE`) and URL.
   - Add headers (`Content-Type: application/json` for requests with a body).

3. **Enter Request Bodies**:
   - For routes requiring a request body (e.g., `test-create-user`, `test-reset-password`), provide the JSON data in the **Body** tab.

4. **Send Requests**:
   - Ensure your backend server is running locally on `http://localhost:8000`.
   - Send the requests and verify the responses.


