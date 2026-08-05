import { MicIcon, MicOffIcon, MonitorIcon, PhoneOffIcon, Volume2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const AudioHuddleBar = ({ activeHuddleChannel, onLeaveHuddle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  if (!activeHuddleChannel) return null;

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    toast(isMuted ? "Microphone Unmuted" : "Microphone Muted", {
      icon: isMuted ? "🎙️" : "🔇",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing((prev) => !prev);
    toast(isScreenSharing ? "Stopped Screen Share" : "Screen Sharing Active", {
      icon: "💻",
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-4 px-5 py-3 bg-[#1e1035]/90 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-xl animate-fadeIn min-w-[340px] max-w-lg text-white">
      {/* Huddle Info & Active Waveform */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 bg-purple-600/30 rounded-xl border border-purple-400/40">
          <Volume2Icon className="w-5 h-5 text-purple-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Audio Huddle</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">LIVE</span>
          </div>
          <span className="text-sm font-semibold text-white/90 truncate max-w-[150px]">
            {activeHuddleChannel.data?.name || activeHuddleChannel.id}
          </span>
        </div>
      </div>

      {/* Animated Waveform Lines */}
      <div className="flex items-center gap-1 h-5 px-2">
        <span className="w-1 bg-purple-400 rounded-full animate-[bounce_1s_infinite_100ms] h-3" />
        <span className="w-1 bg-purple-300 rounded-full animate-[bounce_1s_infinite_300ms] h-5" />
        <span className="w-1 bg-purple-400 rounded-full animate-[bounce_1s_infinite_200ms] h-4" />
        <span className="w-1 bg-purple-300 rounded-full animate-[bounce_1s_infinite_400ms] h-2" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          className={`p-2 rounded-xl border transition-all ${
            isMuted
              ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
              : "bg-white/10 border-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
          className={`p-2 rounded-xl border transition-all ${
            isScreenSharing
              ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30"
              : "bg-white/10 border-white/10 text-white hover:bg-white/20"
          }`}
        >
          <MonitorIcon className="w-4 h-4" />
        </button>

        {/* Leave Huddle */}
        <button
          onClick={onLeaveHuddle}
          title="Leave Huddle"
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <PhoneOffIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AudioHuddleBar;
