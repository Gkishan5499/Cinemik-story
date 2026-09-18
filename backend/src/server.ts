import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Configure server timeouts (10 minutes) for large media uploads to Cloudinary
server.requestTimeout = 600000;
server.headersTimeout = 600000;
server.keepAliveTimeout = 600000;