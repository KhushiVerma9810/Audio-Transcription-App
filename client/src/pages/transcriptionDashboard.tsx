import React, { useState, useEffect } from "react";
import {
  Loader2,
  FileAudio,
  CheckCircle2,
  XCircle,
  List,
  Send,
} from "lucide-react";
import {
  createTranscription,
  listTranscriptions,
} from "../services/transcriptionService";
import { Transcription, TranscriptionResponse } from "../interfaces/interface";


export default function TranscriptionDashboard() {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<TranscriptionResponse | null>(null);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchTranscriptions = async () => {
    setLoadingHistory(true);
    try {
      const res = await listTranscriptions();
      const data = res.transcriptions as Transcription[];
      setTranscriptions(data);
    } catch (err) {
      console.error("Error fetching transcriptions:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioUrl.trim()) {
      setError("Please enter a valid audio URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const data: TranscriptionResponse = await createTranscription(audioUrl);

      setSuccess(data);
      setAudioUrl("");

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      if (showHistory) {
        fetchTranscriptions();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchTranscriptions();
    }
  }, [showHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptLTggOHY0aC00di00aDR6bTggMHY0aC00di00aDR6bS04IDh2NGgtNHYtNGg0em04IDh2NGgtNHYtNGg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <FileAudio className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Audio Transcription
          </h1>
          <p className="text-gray-400 text-lg">
            Convert your audio files to text with AI precision
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="audioUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Audio URL
              </label>
              <input
                type="url"
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Start Transcription
                </>
              )}
            </button>
          </form>

          {success && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-400 font-semibold mb-1">Success!</p>
                <p className="text-gray-300 text-sm mb-2">{success.message}</p>
                <p className="text-gray-400 text-xs">
                  Transcription ID:{" "}
                  <span className="font-mono text-purple-400">
                    {success.id}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold mb-1">Error</p>
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* History Toggle */}
        <div className="text-center mb-20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all"
          >
            <List className="w-5 h-5" />
            {showHistory ? "Hide" : "Show"} Transcription History
          </button>
        </div>

        {/* History List */}
        {showHistory && (
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <List className="w-6 h-6 text-purple-400" />
              All Transcriptions
            </h2>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : transcriptions.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No transcriptions found
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                {transcriptions.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-purple-400 mb-2">
                          {t.id}
                        </p>
                        <a
                          href={t.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors block truncate mb-2"
                        >
                          {t.audioUrl}
                        </a>
                        <p className="text-sm text-gray-300">
                          {new Date(t.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30 flex-shrink-0">
                        active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
