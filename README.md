
This project allows users to upload and download files using Cloudinary for storage. Below is a guide on how the routes are working and how to use them.

## Prerequisites

- Node.js
- npm
- MongoDB
- Cloudinary account / google firebase account (I have used Cloudinary because it gives some free space without any payment method)

## Setup

1. Clone the repository:
    ```sh
    git clone <repository-url>
    

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Cloudinary credentials:
    ```plaintext
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Routes

### Registration and Login

- **POST /user/register**
    - Description: Registers a new user.
    - Request: JSON object with `username` and `password`.
    - Response: JSON object with a success message or an error message.

- **POST /user/login**
    - Description: Logs in a user and returns a token.
    - Request: JSON object with `username` and `password`.
    - Response: JSON object with a token or an error message.

### Home Route

- **GET /home**
    - Description: Renders the home page where users can upload and view their files.
    - Middleware: `authMiddleware` (ensures the user is authenticated)
    - Response: Renders `home.ejs` with the user's files.
    - Note: You must be logged in and provide a valid token to access this route.

### Upload Route

- **POST /upload**
    - Description: Uploads a file to Cloudinary and saves the file information to the database.
    - Middleware: `authMiddleware`, `upload.single('file')` (handles file upload)
    - Request: `multipart/form-data` with a file field named `file`
    - Response: JSON object with the uploaded file information or an error message.
    - Note: You must be logged in and provide a valid token to access this route.

### Download Route

- **GET /download/:path**
    - Description: Generates a signed URL for the file from Cloudinary and redirects the user to download the file.
    - Middleware: `authMiddleware` (ensures the user is authenticated)
    - Params: `path` (the path of the file to be downloaded)
    - Response: Redirects to the signed URL for the file or an error message.
    - Note: You must be logged in and provide a valid token to access this route.

## Views

### Home View

- **File:** `views/home.ejs`
- Description: Displays the home page with an upload form and a list of the user's files. Users can click the "Upload file" button to show the upload form and upload files. The uploaded files are listed with a download button.

### Login View

- **File:** `views/login.ejs`
- Description: Displays the login form where users can enter their username and password to log in.

## Middleware

### Auth Middleware

- **File:** `middlewares/auth.js`
- Description: Ensures that the user is authenticated before allowing access to certain routes.

## Models

### File Model

- **File:** `models/files.models.js`
- Description: Defines the schema for storing file information in the database.

## Configuration

### Cloudinary Configuration

- **File:** `config/cloudinary.config.js`
- Description: Configures Cloudinary with the API key and secret from the environment variables.

### Multer Cloudinary Configuration

- **File:** `config/multer.cloudinary.config.js`
- Description: Configures Multer to use Cloudinary storage for file uploads.

## Running the Project

1. Ensure MongoDB is running.
2. Start the server:
    ```sh
    npm start
    ```
3. Open your browser and navigate to `http://localhost:3001/home` to access the home page.

## License

This project is licensed under the MIT License.
