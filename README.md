# Mock API Documentation

This is a simple Node.js-based Mock API designed for authentication and user information retrieval. It uses JWT for authentication and implements basic CORS handling.

## Features
- **Authenticate users**: Validate username and password, and return a JWT token.
- **User information**: Verify the JWT token and return user details.
- **CORS support**: Allows cross-origin requests for web applications.

---

## Setup

### Prerequisites
- **Node.js**: Ensure that Node.js is installed on your system.
- **npm**: The Node.js package manager.

### Installation
1. Clone the repository or copy the `mock-api.js` file.
2. Run the following command to install dependencies (if needed):

   ```bash
   npm install bcrypt jsonwebtoken

3. Start the server:

    ```bash
    node app.js

