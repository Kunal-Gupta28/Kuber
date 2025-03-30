

The documentation for the User Profile and Logout endpoints is clear and well-structured. Below is a revised version with consistent formatting and minor improvements for clarity:

---

## User Profile Endpoint Documentation

### Endpoint
**`GET /users/profile`**

### Description
Retrieve the profile information of the authenticated user.

### Request

#### Headers
- **`Authorization`** (string, required): The authentication token of the user.

### Response

#### Success
- **Status Code**: `200 OK`
- **Body**:
    ```json
    {
        "username": "user's username",
        "email": "user's email",
        "createdAt": "account creation date"
    }
    ```

#### Errors
- **`401 Unauthorized`**  
    - **Reason**: Missing or invalid authentication token.  
    - **Body**:
        ```json
        {
            "error": "Unauthorized access"
        }
        ```

- **`500 Internal Server Error`**  
    - **Reason**: An error occurred while processing the request.  
    - **Body**:
        ```json
        {
            "error": "An error occurred while processing the request"
        }
        ```

---

## User Logout Endpoint Documentation

### Endpoint
**`POST /users/logout`**

### Description
Log out the authenticated user by invalidating their authentication token.

### Request

#### Headers
- **`Authorization`** (string, required): The authentication token of the user.

### Response

#### Success
- **Status Code**: `200 OK`
- **Body**:
    ```json
    {
        "message": "User logged out successfully"
    }
    ```

#### Errors
- **`401 Unauthorized`**  
    - **Reason**: Missing or invalid authentication token.  
    - **Body**:
        ```json
        {
            "error": "Unauthorized access"
        }
        ```

- **`500 Internal Server Error`**  
    - **Reason**: An error occurred while processing the request.  
    - **Body**:
        ```json
        {
            "error": "An error occurred while processing the request"
        }
        ```
