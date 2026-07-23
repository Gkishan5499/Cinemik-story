# Frontend & Backend Integration - Quick Start

## What's Been Built

### ✅ Backend (Already Completed)
- Complete auth system with login/signup
- Creator and admin role management
- Story CRUD (Create, Read, Update, Delete)
- Episode management per story
- Comments with approval workflow
- Like system for stories
- Admin dashboard for user/story/comment management
- Swagger API documentation at `http://localhost:5000/api/docs`

### ✅ Frontend (Just Completed)

#### Pages Created:
1. **Auth Pages**
   - `/auth/login` - User login
   - `/auth/signup` - New account creation

2. **Public Pages**
   - `/story` - Browse all published stories
   - `/story/[id]` - Read story with episodes, comments, and like button

3. **Creator Pages** (login required, creator role)
   - `/dashboard` - Creator dashboard with story list and stats
   - `/dashboard/stories/[id]` - Edit story, manage episodes

4. **Admin Pages** (login required, admin role)
   - `/admin` - Admin panel with tabs for:
     - Users management
     - Stories moderation
     - Comments approval/moderation

#### Features:
- User authentication with JWT tokens
- Protected routes based on role (creator/admin)
- Real-time engagement stats (likes, comments count)
- Full CRUD for stories and episodes
- Comment posting and moderation
- Responsive design with Tailwind CSS
- Custom anime aesthetic UI matching your design

---

## Quick Start Guide

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd anime-story
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

### 3. Access the App
- **Homepage**: http://localhost:3000
- **Public Stories**: http://localhost:3000/story
- **Login**: http://localhost:3000/auth/login
- **Signup**: http://localhost:3000/auth/signup

### 4. Create Test Accounts

#### Test Creator Account:
```
Email: creator@example.com
Password: password123
Name: Story Creator
```
Then signup and you'll be able to:
- Create/edit/delete stories
- Add episodes
- See engagement metrics (likes/comments)

#### Test Admin Account (via Swagger):
Use Swagger at `http://localhost:5000/api/docs` to:
1. Call `POST /api/auth/signup` to create admin (set role: "admin")
2. Use returned token to manage everything

Or access directly:
```bash
# From backend Swagger UI, create admin user with role "admin"
```

---

## What You Can Do Now

### As a Creator:
- ✅ Sign up / Login
- ✅ Create stories with title & description
- ✅ Add episodes with content
- ✅ Edit/delete your stories and episodes
- ✅ View engagement (likes & comments count)

### As a Public User:
- ✅ Browse all stories
- ✅ Read stories and episodes
- ✅ Like stories (login required)
- ✅ Comment and engage (login required)

### As an Admin:
- ✅ Manage all users (create/edit/delete)
- ✅ Moderate all stories and comments
- ✅ Approve/unapprove comments
- ✅ Delete inappropriate content
- ✅ Create stories for other creators

---

## Environment Variables

### Frontend (anime-story/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
Configure MongoDB connection and port:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API Endpoints Available

All documented in Swagger at: `http://localhost:5000/api/docs`

**Key Endpoints:**
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/story/public` - List public stories
- `POST /api/story` - Create story (creator only)
- `POST /api/story/:id/episodes` - Add episode
- `POST /api/story/:id/comments` - Comment on story
- `POST /api/story/:id/like` - Like story
- `GET /api/auth/admin/users` - List users (admin only)
- `GET /api/story/admin/all` - All stories (admin only)
- `GET /api/story/admin/comments/all` - All comments (admin only)

---

## Architecture

```
Frontend (Next.js 16 + React 19)
├── app/
│   ├── auth/ (login/signup)
│   ├── dashboard/ (creator)
│   ├── admin/ (admin only)
│   └── story/ (public + detail)
├── components/
│   └── ui/ (Navbar with auth)
├── lib/
│   ├── api.ts (all API functions)
│   └── AuthContext.tsx (user state management)
└── .env.local

Backend (Express + TypeScript + MongoDB)
├── src/
│   ├── routes/ (auth, story, upload)
│   ├── controllers/ (business logic)
│   ├── models/ (User, Story, Episode, Comment)
│   ├── middleware/ (auth, role checks)
│   └── docs/ (Swagger setup)
└── .env
```

---

## Next Steps (Optional)

1. **Upload files** - Configure Cloudinary for image/video uploads in story/episodes
2. **Email notifications** - Add email alerts for new comments/likes
3. **Pagination** - Add pagination to story and comment lists
4. **Search** - Add full-text search for stories
5. **Trending** - Add trending stories based on likes
6. **User profiles** - Creator profile pages with their stories
7. **Notifications** - Real-time notifications for engagement

---

## Troubleshooting

**Frontend won't connect to backend?**
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Make sure backend is running on port 5000
- Check CORS is enabled in backend

**API returns 401 Unauthorized?**
- Login first to get JWT token
- Token is automatically stored in localStorage
- Clear browser storage if needed and login again

**Build fails?**
- Run `npm install` in both frontend and backend
- Clear `.next` folder and build again
- Check Node version (16+ required)

---

Enjoy building! The app is fully functional and ready to use. 🚀
