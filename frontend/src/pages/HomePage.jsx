import { UserButton } from "@clerk/clerk-react";
import { HashIcon, MenuIcon, MessageCircleHeart, PlusIcon, UsersIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react";
import ChannelListError from "../components/ChannelListError";
import ChannelListLoading from "../components/ChannelListLoading";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelHeader from "../components/CustomChannelHeader";
import CustomChannelPreview from "../components/CustomChannelPreview";
import EmptyChannelState from "../components/EmptyChannelState";
import MobileSidebar from "../components/MobileSidebar";
import PageLoader from "../components/PageLoader";
import UsersList from "../components/UsersList";
import { useStreamChat } from "../hooks/useStreamChat";
import "../styles/stream-chat-theme.css";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { chatClient, error, isLoading } = useStreamChat();

  // Set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // Handle channel selection
  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    setSearchParams({ channel: channel.id });
    setIsMobileSidebarOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] to-[#7209b7]">
        <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md">
          <XIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-white/70 mb-6">Something went wrong. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#4a154b] to-[#350d36] border-b border-white/10 sticky top-0 z-40">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Connectify" className="w-7 h-7 rounded-md" />
              <span className="font-semibold text-white">Connectify</span>
            </div>
            <UserButton />
          </div>

          {/* Mobile Sidebar */}
          {isMobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div
                className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm animate-slideIn"
                onClick={(e) => e.stopPropagation()}
              >
                <MobileSidebar
                  chatClient={chatClient}
                  activeChannel={activeChannel}
                  onChannelSelect={handleChannelSelect}
                  onClose={() => setIsMobileSidebarOpen(false)}
                  onCreateChannel={() => {
                    setIsMobileSidebarOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* LEFT SIDEBAR - Desktop */}
          <div className="str-chat__channel-list hidden lg:block">
            <div className="team-channel-list">

              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Connectify</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="user-button-wrapper">
                    <UserButton />
                  </div>
                </div>
              </div>

              {/* CHANNELS LIST */}
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="create-channel-btn"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Channel</span>
                  </button>
                </div>

                {/* CHANNEL LIST */}
                <ChannelList
                  filters={{ members: { $in: [chatClient?.user?.id] } }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(channel) => setSearchParams({ channel: channel.id })}
                    />
                  )}
                  List={({ children, loading, error }) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="w-4 h-4" />
                          <span>Channels</span>
                        </div>
                      </div>

                      {/* Better Loading Component */}
                      {loading && <ChannelListLoading />}

                      {/* Better Error Component */}
                      {error && (
                        <ChannelListError
                          onRetry={() => window.location.reload()}
                        />
                      )}

                      {/* Channel Items */}
                      <div className="channels-list">
                        {!loading && !error && (!children || children.length === 0) ? (
                          <EmptyChannelState
                            type="channels"
                            onCreateClick={() => setIsCreateModalOpen(true)}
                          />
                        ) : (
                          children
                        )}
                      </div>

                      {/* Direct Messages Section */}
                      <div className="section-header direct-messages">
                        <div className="section-title">
                          <UsersIcon className="w-4 h-4" />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="chat-main">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <Window>
                  <CustomChannelHeader
                    onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
                  />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white/98">
                <div className="text-center max-w-md px-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <MessageCircleHeart className="w-10 h-10 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Connectify</h2>
                  <p className="text-gray-600 mb-8">
                    Select a channel or start a conversation to begin messaging with your team.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Create Your First Channel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;