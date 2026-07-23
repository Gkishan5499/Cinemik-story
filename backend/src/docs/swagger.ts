import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Anime Story Backend API",
    version: "1.0.0",
    description:
      "API documentation for authentication, stories, episodes, comments, likes, and admin management.",
  },
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:5000",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users (Admin)" },
    { name: "Stories" },
    { name: "Episodes" },
    { name: "Comments" },
    { name: "Admin Moderation" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid credentials" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["creator", "admin"] },
          avatar: { type: "string" },
          bio: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Story: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          coverImage: { type: "string" },
          creator: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          genre: { type: "string" },
          tags: {
            type: "array",
            items: { type: "string" },
          },
          status: { type: "string", enum: ["draft", "published"] },
          views: { type: "number" },
          likesCount: { type: "number" },
          commentsCount: { type: "number" },
          episodesCount: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Episode: {
        type: "object",
        properties: {
          _id: { type: "string" },
          story: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          images: {
            type: "array",
            items: { type: "string" },
          },
          episodeNumber: { type: "number" },
          views: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          story: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/Story" }],
          },
          episode: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/Episode" }],
            nullable: true,
          },
          text: { type: "string" },
          isApproved: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Signup as creator",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Success" } },
      },
      put: {
        tags: ["Auth"],
        summary: "Update current user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
    },
    "/api/auth/users": {
      get: {
        tags: ["Users (Admin)"],
        summary: "List all users",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Success" } },
      },
      post: {
        tags: ["Users (Admin)"],
        summary: "Create user (admin/creator)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  role: { type: "string", enum: ["creator", "admin"] },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/auth/users/{id}": {
      put: {
        tags: ["Users (Admin)"],
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Users (Admin)"],
        summary: "Delete user with related content cleanup",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/api/stories": {
      get: {
        tags: ["Stories"],
        summary: "Get published stories",
        parameters: [
          { name: "genre", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
        ],
        responses: { "200": { description: "Success" } },
      },
      post: {
        tags: ["Stories"],
        summary: "Create story (creator/admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  genre: { type: "string" },
                  tags: {
                    description: "Comma-separated tags",
                    type: "string",
                  },
                  status: { type: "string", enum: ["draft", "published"] },
                  creatorId: {
                    type: "string",
                    description: "Admin only: assign story to creator",
                  },
                  coverImage: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/stories/my/list": {
      get: {
        tags: ["Stories"],
        summary: "Get creator stories with likes/comments/episodes count",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/stories/{id}": {
      get: {
        tags: ["Stories"],
        summary: "Get story details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Success" } },
      },
      put: {
        tags: ["Stories"],
        summary: "Update story (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  genre: { type: "string" },
                  tags: { type: "string" },
                  status: { type: "string", enum: ["draft", "published"] },
                  coverImage: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Stories"],
        summary: "Delete story (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/api/stories/{id}/like": {
      post: {
        tags: ["Stories"],
        summary: "Toggle like on story",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/stories/{storyId}/episodes": {
      get: {
        tags: ["Episodes"],
        summary: "Get episodes by story",
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Success" } },
      },
      post: {
        tags: ["Episodes"],
        summary: "Create episode (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "episodeNumber"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  episodeNumber: { type: "number" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/stories/{storyId}/episodes/{episodeId}": {
      put: {
        tags: ["Episodes"],
        summary: "Update episode (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
          { name: "episodeId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Episodes"],
        summary: "Delete episode (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
          { name: "episodeId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/api/stories/{storyId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "Get approved comments by story",
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Success" } },
      },
      post: {
        tags: ["Comments"],
        summary: "Create comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "storyId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["text"],
                properties: {
                  text: { type: "string" },
                  episodeId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/stories/comments/{commentId}": {
      put: {
        tags: ["Comments"],
        summary: "Update comment (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "commentId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete comment (owner/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "commentId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/api/stories/admin/all": {
      get: {
        tags: ["Admin Moderation"],
        summary: "Get all stories (admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/stories/admin/comments": {
      get: {
        tags: ["Admin Moderation"],
        summary: "Get all comments (admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/stories/admin/comments/{commentId}/approve": {
      patch: {
        tags: ["Admin Moderation"],
        summary: "Approve/unapprove comment (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "commentId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  isApproved: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};
