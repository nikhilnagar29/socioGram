# SocioGram
A social media platform for sharing posts and connecting with friends.

---
## 🌐 Visit SocioGram
You can visit or create an account on SocioGram at:
➡️ [https://nikhil-nagar.vercel.app/sociogram](https://nikhil-nagar.vercel.app/sociogram)

---
## 📌 Project Title and Description
**SocioGram** is a social media platform where users can create profiles, share posts, like, comment, and follow others. It offers secure authentication and an engaging user experience.

---
## 🚀 Features
### 1. Create Account and Log In
- Users register with email, name, and password with OTP verification.
  - **Tech:** Nodemailer (OTPs), bcrypt, Encrypt (password security)

### 2. Post an Image or Text
- Share images or text posts with like, save, and comment features.
  - **Tech:** Multer (image uploads)

### 3. Home Page
- Displays posts from followers and saved posts.
  - **Future Solution:** Use React.js for reusable components and efficient routing.

### 4. Explore Page
- Search and discover profiles.

### 5. Save and Like Pages
- View liked or saved posts.

### 6. Profile Page
- Displays user’s posts and follower/following details.

### 7. Delete Post and Account
- Users can remove their posts or account with complete data deletion.

### 8. Authorization and Authentication
- Secure sessions using:
  - Cookie-parser
  - JSON Web Token (JWT)
  - Encrypt

### 9. MongoDB Schemas
- **Schemas:** User, Post, Comment
- **Optimization:** Store saved posts using `post_id` for faster access.

---
## 💻 Technologies Used
### Backend:
- Node.js, Express.js, MongoDB, Redis, Multer, bcrypt, jsonwebtoken
### Frontend:
- EJS, Tailwind CSS, JavaScript
### Tools:
- Git/GitHub, Render (hosting)

---
## ⚙️ Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/project-name.git
   ```
2. **Create `.env` file:**
   ```env
   PASSWORD="PASSWORD_DEMO"
   USERNAME="DEMO"
   MONGODB_URL="DEMO"
   URL="DEMO"
   REDIS_URL="DEMO"
   EMAIL="DEMO"
   EMAIL_PASS="DEMO"
   JWT_SECRET="DEMO"
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the server:**
   ```bash
   npm start
   ```

---
## 📝 Self Project
This project was created and managed independently for learning and portfolio enhancement.
