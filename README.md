Hey! 👋
I’ve built this project as a simple and clean audio transcription service using Node.js, Express, MongoDB, and Socket.IO.

**The goal was to demonstrate:**

REST API design
Realtime streaming (mocked)
Azure Speech-to-Text integration (with fallback)
Clean architecture
Scalability thinking (not over-engineering)

🛠️ **Tech Stack**
⚙️ **Backend**

**Node.js** – JavaScript runtime for building scalable server-side applications  
**TypeScript** – Type safety and better developer experience  
**Express.js** – Lightweight web framework for REST APIs
**MongoDB**– NoSQL database for storing transcription data 
**Mongoose** – ODM for MongoDB schema modeling 
**Socket.IO** – Realtime communication for streaming transcription (bonus) 
**Zod** – Schema validation for request payloads 
**Azure Speech SDK (mocked)** – Speech-to-text integration 
**Jest & Supertest** – API testing 
**dotenv**– Environment variable management

🌐 **Frontend**

**React** – Component-based UI development 
**TypeScript** – Strong typing for frontend code 
**Axios** – HTTP client for API communication 
**Tailwind CSS** – Utility-first CSS framework for styling 
**React Router** – Client-side routing 
**Socket.IO Client** – Realtime transcription streaming (bonus)

📌**What This Project Does**

Accepts an audio URL
Mocks audio download
Transcribes audio (mock / Azure Speech SDK)
Saves transcription history in MongoDB
Supports realtime transcription streaming using WebSockets
Exposes APIs to fetch recent transcriptions


🧠 **How Things Work (High Level)**
REST APIs
POST /transcription → Mock transcription
POST /azure-transcription → Azure or fallback
GET /transcriptions → Last 30 days history

Realtime Transcription (Socket.IO)
Client sends mocked audio chunks
Server emits partial transcription
On stream end:
Final text is generated
Session metadata is stored in MongoDB

🔌 **Realtime Socket Flow (Simple)**

Client connects via Socket.IO
Sends "audio-chunk" events
Server replies with "transcription-partial"
Client sends "end-stream"
Server saves data + sends "transcription-final"
This simulates how real speech-to-text streaming works.

✅ **Assumptions Made**

Audio download is mocked (no real media processing)
Azure Speech SDK may not always be available
Transcription text is mocked unless Azure key exists
Authentication is out of scope
Focus is on architecture, not UI complexity

🧪**Error Handling**

Zod handles request validation
Centralized error middleware
Async errors handled via asyncHandler
Azure calls wrapped with retry + timeout safety

📁 **Code Structure Explanation**

This project is structured in a clean and modular way to keep the code easy to understand, maintain, and scale. Each folder has a clear responsibility.

📂 **src/**

This is the main source folder where all backend logic lives.

📂 **src/routes/**

Handles API route definitions.
Defines endpoints like:
POST /transcription
GET /transcriptions
POST /azure-transcription

Routes connect HTTP requests to their respective controllers.

**Validation middleware is applied here.**

👉 Keeps routing logic separate from business logic.

📂**src/controllers/**

Handles request and response logic.

Reads input from req.body or req.params
Calls service functions
Sends formatted responses to the client

Example:

transcription.controller.ts
azure.controller.ts

👉 Controllers stay lightweight and focus only on HTTP handling.

📂**src/services/**

Contains business logic and external integrations.

Database operations (MongoDB)
Azure Speech-to-Text logic
Audio download mocking
Retry logic for failed operations

Example:

transcription.service.ts
azure.service.ts
download.service.ts

👉 Makes the code reusable and easy to test.

📂 **src/models/**

Defines MongoDB schemas and models.
Uses Mongoose to define data structure
Example fields: audioUrl , transcription , source , createdAt

👉 Keeps database structure centralized.

📂 **src/validators/**
Handles request validation using Zod.
Ensures valid input before reaching controllers

Example:

audioUrl must be a valid URL

👉 Prevents bad data and improves API reliability.

📂 **src/middlewares/**

Contains Express middleware.
Error handling middleware
Request validation middleware

👉 Keeps common logic reusable and consistent.

📂 **src/utils/**

Utility helper functions.
asyncHandler – handles async errors
retry – retries failed operations with backoff

👉 Avoids repeated code across the app.

📂 **tests/**

Contains unit and integration tests.
Uses Jest and Supertest
Tests controllers and APIs

👉 Ensures code reliability and prevents regressions.

📄 **app.ts / server.ts**

Application entry point.
Initializes Express
Registers routes and middleware
Connects to MongoDB
Starts the server

📦 **MongoDB Indexing Notes**

**Query used: find({ createdAt: { $gte: since } }).sort({ createdAt: -1 })**

**Index I would add for 100M+ records:**

**db.transcriptions.createIndex({ createdAt: -1 })**

✔ This makes date-range queries fast
✔ Prevents full collection scans
✔ Essential for large datasets

🚀 **Scalability & Performance (Short & Practical)**
**If this had 10k+ concurrent requests, I would:**

**1.Add caching (Redis)**
  Cache recent transcriptions
  Reduce MongoDB load
  
**2.Use queues (BullMQ / RabbitMQ)**
  Offload transcription jobs
  Prevent API blocking
  
**3 Containerize & autoscale**
  Docker + Kubernetes
  Horizontal scaling for APIs and sockets

🔄 **How I’d Improve This for Production**

1. Replace mock download with real audio streaming 
2. Use Azure SDK streaming instead of stub  
3. Add authentication & rate limiting  
4. Add observability (logs, metrics)  
5. Separate realtime service into its own microservice

**Thanks for reviewing this project** 🙌
