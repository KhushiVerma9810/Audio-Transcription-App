import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Mic, Square, Wifi, WifiOff, Volume2, Loader2 } from "lucide-react";
import { SOCKET_URL } from "../utils/config";
import { TranscriptionData } from "../interfaces/interface";


export default function RealtimeTranscription() {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [finalTranscripts, setFinalTranscripts] = useState<TranscriptionData[]>(
    []
  );
  const [chunkCount, setChunkCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [finalTranscripts, partialText]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
      setIsStreaming(false);
    });

    socket.on("transcription-partial", (data) => {
      console.log("Partial:", data);
      const text = data?.partial || "";
      setPartialText(text);
    });

    socket.on("transcription-final", (data) => {
      console.log("Final:", data);
      const text =
        typeof data === "string"
          ? data
          : data?.text || data?.final || data?.partial || "";

      if (text) {
        const transcriptData: TranscriptionData = {
          text: text,
          timestamp: Date.now(),
          isFinal: true,
        };
        setFinalTranscripts((prev) => [...prev, transcriptData]);
      }
      setPartialText("");
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      socket.disconnect();
    };
  }, []);

  const startStreaming = () => {
    if (isStreaming) return;

    setFinalTranscripts([]);
    setPartialText("");
    setChunkCount(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!socketRef.current?.connected) {
      socketRef.current?.connect();
    }

    setIsStreaming(true);

    let count = 0;
    intervalRef.current = setInterval(() => {
      socketRef.current?.emit("audio-chunk");
      count++;
      setChunkCount(count);

      if (count === 6) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        socketRef.current?.emit("end-stream");
        setIsStreaming(false);
      }
    }, 1000);
  };

  const clearTranscripts = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFinalTranscripts([]);
    setPartialText("");
    setChunkCount(0);
    setIsStreaming(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptLTggOHY0aC00di00aDR6bTggMHY0aC00di00aDR6bS04IDh2NGgtNHYtNGg0em04IDh2NGgtNHYtNGg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="p-5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-2xl">
                <Volume2 className="w-14 h-14 text-white" />
              </div>
              {isStreaming && (
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Real-time Transcription
          </h1>
          <p className="text-gray-300 text-lg">
            Live audio streaming with instant text conversion
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">
                    Disconnected
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-gray-400 text-sm">Chunks sent: </span>
                <span className="text-white font-bold">{chunkCount}</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-gray-400 text-sm">Transcripts: </span>
                <span className="text-white font-bold">
                  {finalTranscripts.length}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startStreaming}
                disabled={isStreaming}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {isStreaming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Streaming...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Stream
                  </>
                )}
              </button>

              <button
                onClick={clearTranscripts}
                disabled={isStreaming}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Square className="w-5 h-5 text-pink-400" />
              Live Transcript
            </h2>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {finalTranscripts.length === 0 && !partialText ? (
              <div className="text-center py-16">
                <Mic className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">
                  Click "Start Stream" to begin transcription
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {finalTranscripts.map((transcript, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-lg leading-relaxed">
                          {transcript.text}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(transcript.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {partialText && (
                  <div className="p-4 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/30 border-dashed rounded-xl animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg flex-shrink-0">
                        <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 text-lg leading-relaxed italic">
                          {partialText}
                        </p>
                        <p className="text-pink-400 text-xs mt-2 font-semibold">
                          Processing...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h3 className="text-pink-400 font-semibold mb-1 text-sm">Status</h3>
            <p className="text-white text-lg">
              {isStreaming
                ? "🔴 Live"
                : isConnected
                ? "🟢 Ready"
                : "⚪ Offline"}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h3 className="text-purple-400 font-semibold mb-1 text-sm">Mode</h3>
            <p className="text-white text-lg">Real-time Streaming</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h3 className="text-indigo-400 font-semibold mb-1 text-sm">
              Latency
            </h3>
            <p className="text-white text-lg">~1s chunks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
