# 📚 API Documentation

Base URL: `http://localhost:5000/api` (Development)

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... }
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

**Validation Rules:**
- Name: 2-50 characters
- Email: Valid email format
- Password: Min 6 chars, must contain uppercase, lowercase, and number

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "department": null,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

## Complaint Endpoints

### Create Complaint
**POST** `/complaints`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: "Wi-Fi not working"
category: "IT"
description: "Internet connection keeps dropping in library"
priority: "high"
attachments: [File, File, ...]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "complaint": {
      "_id": "...",
      "userId": { ... },
      "title": "Wi-Fi not working",
      "category": "IT",
      "description": "...",
      "status": "pending",
      "priority": "high",
      "attachments": ["file1.jpg", "file2.pdf"],
      "timeline": [...],
      "createdAt": "..."
    }
  }
}
```

**Categories:**
- IT
- Infrastructure
- Library
- Hostel
- Transport
- Canteen
- Academic
- Administrative
- Security
- Other

**Priorities:**
- low
- medium
- high
- critical

---

### Get My Complaints
**GET** `/complaints/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?status=pending&category=IT&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "complaints": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

---

### Get All Complaints (Admin/Staff)
**GET** `/complaints/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin (all), Staff (assigned only)

**Query Parameters:**
```
?status=pending&category=IT&priority=high&search=wifi&page=1&limit=10
```

---

### Get Complaint By ID
**GET** `/complaints/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** 
- User: Own complaints only
- Staff: Assigned complaints only
- Admin: All complaints

**Response (200):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "_id": "...",
      "userId": { "name": "...", "email": "..." },
      "title": "...",
      "assignedTo": { "name": "...", "email": "..." },
      "timeline": [
        {
          "status": "pending",
          "note": "Complaint submitted",
          "updatedBy": { ... },
          "timestamp": "..."
        }
      ],
      ...
    }
  }
}
```

---

### Update Complaint Status
**PUT** `/complaints/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin, Staff (assigned only)

**Request Body:**
```json
{
  "status": "in-progress",
  "note": "Working on the issue"
}
```

**Statuses:**
- pending
- in-progress
- resolved
- rejected

---

### Assign Complaint
**PUT** `/complaints/:id/assign`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin only

**Request Body:**
```json
{
  "assignedTo": "<staff_user_id>"
}
```

---

### Update Priority
**PUT** `/complaints/:id/priority`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin only

**Request Body:**
```json
{
  "priority": "critical"
}
```

---

### Delete Complaint
**DELETE** `/complaints/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** Admin only

---

## Admin Endpoints

All admin endpoints require admin role.

### Get Analytics
**GET** `/admin/analytics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalComplaints": 150,
      "totalUsers": 50,
      "recentComplaints": 25,
      "avgResolutionTime": 48
    },
    "statusBreakdown": {
      "pending": 30,
      "in-progress": 45,
      "resolved": 70,
      "rejected": 5
    },
    "categoryBreakdown": [...],
    "priorityBreakdown": [...],
    "complaintsTrend": [...],
    "staffPerformance": [...]
  }
}
```

---

### Get All Users
**GET** `/admin/users`

**Query Parameters:**
```
?role=staff&search=john&page=1&limit=10
```

---

### Get Staff List
**GET** `/admin/staff`

Returns active staff and admin users for assignment.

---

### Update User Role
**PUT** `/admin/users/:id/role`

**Request Body:**
```json
{
  "role": "staff"
}
```

**Roles:**
- user
- staff
- admin

---

### Toggle User Status
**PUT** `/admin/users/:id/toggle-status`

Activates/deactivates user account.

---

### Delete User
**DELETE** `/admin/users/:id`

Permanently deletes user (cannot delete self).

---

## Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

- **Rate:** 100 requests per 15 minutes per IP
- **Applies to:** All /api/* endpoints

When rate limit exceeded:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## File Upload

**Accepted Types:**
- Images: .jpg, .jpeg, .png, .gif
- Documents: .pdf, .doc, .docx

**Limits:**
- Max file size: 5MB
- Max files per complaint: 5

**Access Uploaded Files:**
```
GET http://localhost:5000/uploads/<filename>
```

---

**Last Updated:** February 2026
