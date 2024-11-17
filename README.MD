# Stock and News Data Visualization App

Created by Sergey Trefilov. BDA-2305.

This application provides user authentication with role-based access (Admin, Editor), 2FA, portfolio management, and integrates with stock and news APIs for dynamic data presentation.


## Installation

Follow these steps to install and set up the application locally:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/serg1uss/backend-final-portfolio.git
cd your-repository-folder
```

### 2. Install MongoDB

You can install MongoDB locally or use MongoDB Atlas (an online MongoDB service).

- **For local installation**, follow the instructions in the [MongoDB Documentation](https://www.mongodb.com/docs/manual/installation/).
  
- **For MongoDB Atlas**: 
  1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  2. Create a new cluster and get the connection string (this will be used later).

### 3. Install Dependencies

After cloning the repo, run the following command to install necessary dependencies:

```bash
npm install
```

### 4. Create Accounts and Get API Keys

You will need the following API keys to use the features of the app:

- **News API**: Register at [News API](https://newsapi.org/) to get your API key.
- **AlphaVantage API**: Register at [AlphaVantage](https://www.alphavantage.co/) to get your API key.

### 5. Set Up Environment Variables

Create a `.env` file in the root directory or set up your environment variables using your system’s environment management.

Here are the variables you need to add to your `.env` file:

```env
JWT_SECRET=your-jwt-secret-key
MONGODB_URL=your-mongodb-connection-url
SMPT_USER=your-smtp-username
SMPT_PASS=your-smtp-password
SMPT_HOST=your-smtp-host
AV_API=your-alphavantage-api-key
NEWS_API=your-newsapi-api-key
```

- **JWT_SECRET**: A secret key for signing JSON Web Tokens.
- **MONGODB_URL**: Connection string for MongoDB (you can get this from MongoDB Atlas or your local setup).
- **SMPT_USER/SMPT_PASS/SMPT_HOST**: SMTP details for sending emails (e.g., for registration confirmation).
- **AV_API**: API key for AlphaVantage.
- **NEWS_API**: API key for NewsAPI.

### 6. Run the App

Now that you have set up everything, you can run the app by using the following command:

```bash
node server.js
```

The app will start running on `http://localhost:3000` (or another port if configured).


---

## Functionality

### 1. Navbar

- The navbar provides navigation links to different sections of the app (home, stock data visualization, news, portfolio, etc.).

### 2. Footer

- A footer is included on each page for consistency, providing information about the app.

### 3. Welcome Page


### 4. Authentication and Authorization

- Users must sign up and log in to access the app.
- Different user roles (Admin, Editor, User) have different levels of access:
  - **Admin**: Full access to the app, including the ability to modify and delete items.
  - **Editor**: Can create items.

### 5. 2FA (Two-Factor Authentication)

- Users are required to set up two-factor authentication during registration for added security.
- 2FA is implemented using a QR code, ensuring only authorized users can access their accounts.

### 6. Portfolio Management

- Users can create and manage their items within the app, allowing them to add pictures, description and title.

### 7. Uploading Images

- Users and admins can upload images to the app (e.g., profile pictures, portfolio images).

### 8. Integration with 2 APIs (News and Stocks)

- **AlphaVantage API**: Users can visualize stock data (e.g., stock prices, time series data) using interactive charts.
- **News API**: Users can view and filter news articles, with a visual representation of data (e.g., number of articles by source or date).

### 9. Appealing Interface

- The interface is designed to be modern and visually appealing, with charts, images, and intuitive navigation.

### 10. Sending Messages After Registration

- After a successful registration, a confirmation email is sent to the user with their account details and next steps.

---

## User Authentication & Roles

1. **Signup**: Users can create an account by providing their username, email, and password.
2. **Login**: After signing up, users can log in to the app with their credentials.
3. **Role Management**

   
### Setting up Admin Role

To make a user an **Admin**, manually update their document in MongoDB.

For example, run this query in MongoDB:

```js
db.users.updateOne({ email: 'user@example.com' }, { $set: { role: 'admin' } });
```

---

## API Integrations

### 1. Stock Data Visualization (AlphaVantage API)

- Fetch stock data (e.g., stock prices, historical data) from AlphaVantage using their API.
- Visualize the stock data using interactive charts.

### 2. News Data Visualization (NewsAPI)

- Fetch news articles related to a specific topic
- Visualize the number of articles by topic.

