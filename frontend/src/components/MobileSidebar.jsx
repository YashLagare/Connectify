import { HashIcon, PlusIcon, UsersIcon, XIcon } from "lucide-react";
import { ChannelList } from "stream-chat-react";
import ChannelListError from "./ChannelListError";
import ChannelListLoading from "./ChannelListLoading";
import CustomChannelPreview from "./CustomChannelPreview";
import EmptyChannelState from "./EmptyChannelState";

const MobileSidebar = ({
    chatClient,
    activeChannel,
    onChannelSelect,
    onClose,
    onCreateChannel
}) => {
    return (
        <div className="team-channel-list h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                    <span className="text-lg font-bold text-white">Connectify</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Create Channel Button */}
            <div className="p-4">
                <button
                    onClick={onCreateChannel}
                    className="create-channel-btn w-full"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Channel</span>
                </button>
            </div>

            {/* Channel List */}
            <div className="flex-1 overflow-y-auto">
                <ChannelList
                    filters={{ members: { $in: [chatClient?.user?.id] } }}
                    options={{ state: true, watch: true }}
                    Preview={({ channel }) => (
                        <CustomChannelPreview
                            channel={channel}
                            activeChannel={activeChannel}
                            setActiveChannel={onChannelSelect}
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

                            {loading && <ChannelListLoading />}
                            {error && <ChannelListError onRetry={() => window.location.reload()} />}

                            <div className="channels-list">
                                {!loading && !error && (!children || children.length === 0) ? (
                                    <EmptyChannelState
                                        type="channels"
                                        onCreateClick={onCreateChannel}
                                    />
                                ) : (
                                    children
                                )}
                            </div>

                            <div className="section-header direct-messages">
                                <div className="section-title">
                                    <UsersIcon className="w-4 h-4" />
                                    <span>Direct Messages</span>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default MobileSidebar;