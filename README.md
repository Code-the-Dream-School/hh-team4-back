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
    "name": "John",
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
      "name": "John",
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
      "name": "John",
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


### Auth Routes and Role-Based Access

## **New Routes**

### **Signup**
- **Endpoint**: `POST /auth/signup`
- **Description**: Registers a new user. The default role is `clerk`.
- **Required Fields**:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, minimum 6 characters)
  - `store` (String, required)
  - `role` (Optional, defaults to `clerk`; can be `admin`, `inventoryManager`, or `clerk`)

#### **Example Request Body**:
```json
{
  "name": "John",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "store": "Main Clinic"
}
```

#### **Expected Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64f8d3...",
    "email": "john.doe@example.com",
    "role": "clerk"
  }
}
```

---

### **Login**
- **Endpoint**: `POST /auth/login`
- **Description**: Logs in a user and returns a JWT token.
- **Required Fields**:
  - `email` (String, required)
  - `password` (String, required)

#### **Example Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

#### **Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8d3...",
    "email": "john.doe@example.com",
    "role": "clerk"
  }
}
```

---

### **Protected Routes**

#### **Admin Dashboard**
- **Endpoint**: `GET /auth/admin-dashboard`
- **Description**: Accessible only to `admin` users.

#### **Clerk Dashboard**
- **Endpoint**: `GET /auth/clerk-dashboard`
- **Description**: Accessible to `admin`, `inventoryManager`, and `clerk` users.

#### **Inventory Manager Dashboard**
- **Endpoint**: `GET /auth/inventory-manager`
- **Description**: Accessible to `admin` and `inventoryManager` users.

---

## **How to Test the Routes on Postman**

### **Step 1: Start the Backend Server**
Ensure the backend server is running:
```bash
npm run dev
```
The server should be accessible at `http://localhost:8000`.

---

### **Step 2: Signup a New User**
1. Open Postman and set the method to `POST`.
2. Use the endpoint:
   ```
   http://localhost:8000/api/v1/auth/signup
   ```
3. Go to the **Body** tab and select **raw** and **JSON**.
4. Enter the following:
   ```json
   {
     "name": "Jane",
     "email": "jane.doe@example.com",
     "password": "SecurePassword123",
     "store": "Clinic B"
   }
   ```
5. Click **Send**.
6. Confirm the user is created successfully.

---

### **Step 3: Login to Get a Token**
1. Use the endpoint:
   ```
   http://localhost:8000/api/v1/auth/login
   ```
2. Go to the **Body** tab and select **raw** and **JSON**.
3. Enter the following:
   ```json
   {
     "email": "jane.doe@example.com",
     "password": "SecurePassword123"
   }
   ```
4. Click **Send**.
5. Copy the `token` from the response.

---

### **Step 4: Test Protected Routes**
#### **Admin Dashboard**
1. Use the endpoint:
   ```
   http://localhost:8000/api/v1/auth/admin-dashboard
   ```
2. Set the method to `GET`.
3. Go to the **Headers** tab.
4. Add the following header:
   ```
   Key: Authorization
   Value: Bearer <your_token>
   ```
5. Click **Send**.

#### **Clerk Dashboard**
1. Use the endpoint:
   ```
   http://localhost:8000/api/v1/auth/clerk-dashboard
   ```
2. Follow the same steps as above for adding the `Authorization` header.
3. Confirm the response.

#### **Inventory Manager Dashboard**
1. Use the endpoint:
   ```
   http://localhost:8000/api/v1/auth/inventory-manager
   ```
2. Follow the same steps as above for adding the `Authorization` header.
3. Confirm the response.

---

### **Expected Responses for Protected Routes**
- **Admin Dashboard**:
   ```json
   {
     "message": "Welcome, Admin!"
   }
   ```
- **Clerk Dashboard**:
   ```json
   {
     "message": "Welcome, Clerk!"
   }
   ```
- **Inventory Manager Dashboard**:
   ```json
   {
     "message": "Welcome, Inventory Manager!"
   }
   ```

- **Unauthorized Access (Role Mismatch)**:
   ```json
   {
     "success": false,
     "message": "Access denied. You do not have the required permissions."
   }
   ```






## Database Seeding Instructions

This section explains how to seed the database with sample data for testing purposes. The script will populate the database with predefined medications and users.


### **How to Seed the Database**

1. **Install Dependencies**  
   Ensure all necessary dependencies are installed:
   ```bash
   npm install
   ```

2. **Run the Backend**  
   Start the backend to verify the database connection:
   ```bash
   npm run dev
   ```

3. **Seed the Database**  
   In a new terminal window, run the seeding script:
   ```bash
   npm run seed
   ```

4. **Check the Output**  
   You should see messages in the terminal like:
   - "MongoDB connected..."
   - "Existing data cleared!"
   - "Users seeded!"
   - "Medications seeded!"
   - "Database seeding completed and connection closed!"

5. **Verify the Data**  
   - Test the `GET` endpoints in Postman to confirm the seeded data is accessible. 
   - To GET all users, use: /api/v1/test/test-get-users
   - To GET all meds, use: /api/v1/inventory

---

### **Seeded Data**

#### **Medications**
- **Example Data**:
  ```json
  [
    {
      "name": "Ibuprofen",
      "batchCode": "AX12345",
      "expirationDate": "2024-12-31T00:00:00.000Z",
      "type": "Antiinflammatory"
    },
    {
      "name": "Amoxicillin",
      "batchCode": "BX67890",
      "expirationDate": "2025-06-30T00:00:00.000Z",
      "type": "Antibiotic"
    },
    {
      "name": "Acetaminophen",
      "batchCode": "CX13579",
      "expirationDate": "2024-03-15T00:00:00.000Z",
      "type": "Analgesic"
    }
  ]
  ```

#### **Users**
- **Example Data**:
  ```json
  [
    {
      "name": "Admin",
      "email": "admin@example.com",
      "password": "$2b$10$eW5DjhOtaPwM/KxU0N2eZOU41jnpJqlI/lPpuFTB/X/Y1ZgxhsdpG", 
      "role": "admin",
      "store": "Main Clinic",
      "createdAt": "2024-11-24T02:02:07.237Z",
      "updatedAt": "2024-11-24T02:02:07.237Z"
    },
    {
      "name": "Manager",
      "email": "manager@example.com",
      "password": "$2b$10$eW5DjhOtaPwM/KxU0N2eZOU41jnpJqlI/lPpuFTB/X/Y1ZgxhsdpG",
      "role": "inventoryManager",
      "store": "Main Clinic", 
      "createdAt": "2024-11-24T02:02:07.237Z",
      "updatedAt": "2024-11-24T02:02:07.237Z"
    },
    {
      "name": "Clerk",
      "email": "clerk@example.com",
      "password": "$2b$10$eW5DjhOtaPwM/KxU0N2eZOU41jnpJqlI/lPpuFTB/X/Y1ZgxhsdpG",
      "role": "clerk",
      "store": "Main Clinic", 
      "createdAt": "2024-11-24T02:02:07.237Z",
      "updatedAt": "2024-11-24T02:02:07.237Z"
    }
  ]
  ```

---

Database seeding instructions end
