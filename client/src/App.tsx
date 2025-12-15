import { BrowserRouter, Routes, Route } from "react-router-dom";
import TranscriptionDashboard from "./pages/transcriptionDashboard";
import RealtimeTranscription from "./pages/RealtimeTranscription";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TranscriptionDashboard />} />
        <Route path="/realtime" element={<RealtimeTranscription />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
