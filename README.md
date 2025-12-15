Hey! 👋 This is a simple and clean audio transcription service built with Node.js, Express, MongoDB, and Socket.IO. The project demonstrates key concepts in REST API design, realtime streaming (mocked), Azure Speech-to-Text integration (with fallback), clean architecture, and scalability thinking—without over-engineering.

## Features

- Accepts an audio URL and mocks audio download.
- Transcribes audio using mocked data or Azure Speech SDK.
- Saves transcription history in MongoDB.
- Supports realtime transcription streaming via WebSockets.
- Exposes APIs to fetch recent transcriptions.

## Tech Stack

### Backend
- **Node.js** – Scalable server-side runtime.
- **TypeScript** – Type safety and improved developer experience.
- **Express.js** – Lightweight web framework for REST APIs.
- **MongoDB** – NoSQL database for transcription data.
- **Mongoose** – ODM for schema modeling.
- **Socket.IO** – Realtime communication for streaming.
- **Zod** – Schema validation for payloads.
- **Azure Speech SDK (mocked)** – Speech-to-text integration.
- **Jest & Supertest** – API testing.
- **dotenv** – Environment variable management.

### Frontend
- **React** – Component-based UI.
- **TypeScript** – Strong typing.
- **Axios** – HTTP client.
- **Tailwind CSS** – Utility-first styling.
- **React Router** – Client-side routing.
- **Socket.IO Client** – Realtime streaming.

## How It Works

### REST APIs
- `POST /transcription` → Mock transcription.
- `POST /azure-transcription` → Azure or fallback.
- `GET /transcriptions` → Last 30 days history.

### Realtime Transcription (Socket.IO)
- Client connects via Socket.IO.
- Sends "audio-chunk" events.
- Server emits "transcription-partial".
- On "end-stream", server saves data and sends "transcription-final".
- Simulates real speech-to-text streaming.

## Assumptions
- Audio download is mocked (no real media processing).
- Azure Speech SDK may not always be available.
- Transcription text is mocked unless Azure key exists.
- Authentication is out of scope.
- Focus on architecture, not UI complexity.

## Error Handling
- **Zod** for request validation.
- Centralized error middleware.
- Async errors via `asyncHandler`.
- Azure calls with retry + timeout.

## Project Structure

```
src/
├── routes/          # API route definitions (e.g., POST /transcription)
├── controllers/     # Request/response logic (e.g., transcription.controller.ts)
├── services/        # Business logic & integrations (e.g., azure.service.ts)
├── models/          # MongoDB schemas (e.g., Transcription model)
├── validators/      # Zod validations (e.g., audioUrl schema)
├── middlewares/     # Express middleware (e.g., error handling)
├── utils/           # Helpers (e.g., asyncHandler, retry)
tests/               # Jest & Supertest tests
app.ts / server.ts   # Entry points
```

## Setup Instructions

Follow these steps to set up and run the project locally. Ensure you have Node.js (v16+), npm, and MongoDB installed.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Azure Speech SDK key (optional for real transcription; otherwise, mocked)

### 1. Clone the Repository
```bash
git clone https://github.com/KhushiVerma9810/Audio-Transcription-App.git
cd Audio-Transcription-App
```

### 2. Install Dependencies
#### Backend
```bash
cd backend  # Adjust if monolithic
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Environment Variables
Create a `.env` file in the backend root:
```
MONGODB_URI=mongodb://localhost:27017/transcription-db
AZURE_SPEECH_KEY=your-azure-key-here  # Optional
AZURE_SPEECH_REGION=your-region  # Optional
PORT=4000
```

### 4. Set Up MongoDB
- Start MongoDB locally or connect to a cloud instance.
- The app auto-connects via Mongoose.

### 5. Run the Application
#### Backend
```bash
npm run dev
```
- Server runs on `http://localhost:4000`.

#### Frontend
```bash
npm start
```
- Frontend runs on `http://localhost:3000

### 6. Testing
- Run tests: `npm test`
- Uses Jest and Supertest for API testing.

### 7. Usage
- Open the frontend in your browser.
- Upload an audio URL and start transcription.
- Use tools like Postman for API testing (e.g., `POST /transcription`).

## Database Optimization

### MongoDB Indexing Notes
For handling 100M+ records efficiently, add the following index to optimize date-range queries:
```javascript
db.transcriptions.createIndex({ createdAt: -1 })

The API frequently queries transcriptions from the last 30 days
An index on createdAt allows MongoDB to filter and sort efficiently
Ensures consistent performance even with 100M+ records
```
- query used :`find({ createdAt: { $gte: since } }).sort({ createdAt: -1 })`.

## Scalability & Performance Considerations

To handle 10k+ concurrent requests:
- **Caching**: Implement Redis to cache recent transcriptions and reduce MongoDB load.
- **Queues**: Use BullMQ or RabbitMQ to offload transcription jobs and prevent API blocking.
- **Containerization**: Deploy with Docker and Kubernetes for horizontal scaling of APIs and sockets.

## Production Improvements
1. Replace mock download with real audio streaming.
2. Implement full Azure SDK streaming.
3. Add authentication and rate limiting.
4. Integrate observability (logs, metrics).
5. Separate realtime service into a microservice.

Thank you for reviewing this project!
