# 📚 BookNook – A Small Online Library

BookNook is a full-stack online library management application where users can explore books, add books to the library, borrow available books, manage their own book collections, and track their borrowing history.

The platform provides a simple and user-friendly interface with authentication, book management, and borrowing functionality.

## 🌐 Live Website

**Live Demo:** https://booknooklibrary.netlify.app

**Frontend Repository:** https://github.com/abrar-jaman-gazi/booknook-client

**Backend Repository:** https://github.com/abrar-jaman-gazi/booknook-server

**Backend API:** https://booknook-server-pw1e.onrender.com

---

## ✨ Features

- **User Authentication:** Register and log in using email/password or Google authentication.
- **Home Page:** Explore featured content, latest arrivals, and library information.
- **Browse Books:** View all available books in a responsive grid layout.
- **Search and Filter:** Search books and filter them by category.
- **Book Details:** View book descriptions, authors, categories, availability, and other information.
- **Add Books:** Add new books with images, descriptions, authors, categories, and copy information.
- **My Books:** Manage books added by the logged-in user.
- **Edit and Delete:** Update or remove books from your collection.
- **Borrow Books:** Borrow available books from the library.
- **My Borrows:** View borrowed books and borrowing history.
- **Return Books:** Return borrowed books and update library availability.
- **Inventory Management:** Automatically update available copies when books are borrowed or returned.
- **Protected Routes:** Require authentication to access private pages and book details.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Image Upload:** Upload book cover images using ImgBB.

---

## 🛠️ Technologies Used

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Swiper.js
- Lucide React
- Sonner

### Authentication
- Better Auth
- Google OAuth
- MongoDB Adapter
- JWT

### Database and Services
- MongoDB Atlas
- ImgBB

### Deployment
- Netlify

---

## 📂 Project Structure

```text
booknook-client/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── backend-token/
│   │   │   └── upload-image/
│   │   ├── add-book/
│   │   ├── books/
│   │   │   └── [id]/
│   │   ├── login/
│   │   ├── my-books/
│   │   ├── my-borrows/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── shared/
│   └── lib/
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abrar-jaman-gazi/booknook-client.git
```

### 2. Navigate to the Project

```bash
cd booknook-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

DB_NAME=booknook
MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

JWT_SECRET=

IMGBB_API_KEY=

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
```


### 5. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
```

---

## 🔐 Authentication

BookNook uses Better Auth for authentication.

Supported authentication methods:

- Email and password registration.
- Email and password login.
- Google OAuth login.

Authenticated users can access protected pages and perform book management and borrowing operations.

The frontend obtains a backend JWT for authenticated API requests.

---

## 🔌 Backend Integration

The frontend communicates with the Express backend through the following API base URL:

**Local:**
```text
http://localhost:5001
```

**Production:**
```text
https://booknook-server-pw1e.onrender.com
```

The backend handles book management, borrowing operations, inventory updates, and authenticated API requests.

See the [BookNook Server Repository](https://github.com/abrar-jaman-gazi/booknook-server) for backend documentation.

---

## 🚀 Deployment

The frontend is deployed using Netlify.

**Production URL:** https://booknooklibrary.netlify.app

To deploy your own version:

1. Push the client project to GitHub.
2. Connect the repository to Netlify.
3. Configure the required environment variables.
4. Deploy the application.
5. Make sure the production API URL and authentication URLs are configured correctly.

---

## 👨‍💻 Author

**BookNook Development Team**

A full-stack online library management project.

---

## 📄 License

This project was developed for educational purposes.