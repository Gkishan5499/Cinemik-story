# Backend API Docs

## Swagger UI

After starting the backend server, open:

- `http://localhost:5000/api/docs`

If your server runs on another port, replace `5000` with your backend port.

## How To Run

```bash
npm install
npm run dev
```

## Authentication In Swagger

1. Call `POST /api/auth/login` or `POST /api/auth/signup`.
2. Copy the returned JWT token.
3. Click **Authorize** in Swagger UI.
4. Paste the token as: `Bearer <your_token>`

## Main API Groups

- Auth: signup, login, current profile
- Users (Admin): list/create/update/delete users
- Stories: public stories + creator/admin story management
- Episodes: create/update/delete episodes per story
- Comments: create/edit/delete comments
- Admin Moderation: global stories/comments management and approval flow
