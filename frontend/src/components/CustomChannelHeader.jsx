import { useUser } from "@clerk/clerk-react";
import {
    HashIcon,
    LockIcon,
    MenuIcon,
    PinIcon,
    UserPlusIcon,
    UsersIcon,
    VideoIcon
} from "lucide-react";
import { useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import InviteModal from "./InviteModal";
import MembersModal from "./MembersModal";
import PinnedMessagesModal from "./PinnedMessagesModal";

const CustomChannelHeader = ({ onMobileMenuClick }) => {
    const { channel } = useChannelStateContext();
    const { user } = useUser();

    const memberCount = Object.keys(channel.state.members).length;

    const [showInvite, setShowInvite] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showPinnedMessages, setShowPinnedMessages] = useState(false);
    const [pinnedMessages, setPinnedMessages] = useState([]);

    const otherUser = Object.values(channel.state.members).find(
        (member) => member.user.id !== user.id
    );

    const isDM = channel.data?.member_count === 2 && channel.data?.id.includes("user_");

    const handleShowPinned = async () => {
        const channelState = await channel.query();
        setPinnedMessages(channelState.pinned_messages);
        setShowPinnedMessages(true);
    };

    const handleVideoCall = async () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            await channel.sendMessage({
                text: `🎥 Video call started! Join here: ${callUrl}`,
            });
        }
    };

    return (
        <>
            <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    {onMobileMenuClick && (
                        <button
                            onClick={onMobileMenuClick}
                            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <MenuIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* Channel Info */}
                    <div className="flex items-center gap-2.5">
                        {/* Channel Type Icon */}
                        <div className={`p-1.5 rounded-lg ${channel.data?.private ? 'bg-orange-50' : 'bg-blue-50'
                            }`}>
                            {channel.data?.private ? (
                                <LockIcon className="w-4 h-4 text-orange-600" />
                            ) : (
                                <HashIcon className="w-4 h-4 text-blue-600" />
                            )}
                        </div>

                        {/* DM Avatar */}
                        {isDM && otherUser?.user?.image && (
                            <div className="relative">
                                <img
                                    src={otherUser.user.image}
                                    alt={otherUser.user.name || otherUser.user.id}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                {otherUser.user.online && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 
                                 border-2 border-white rounded-full" />
                                )}
                            </div>
                        )}

                        {/* Channel Name */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                    {isDM ? otherUser?.user?.name || otherUser?.user?.id : channel.data?.name || channel.data?.id}
                                </span>
                                {channel.data?.private && (
                                    <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                        PRIVATE
                                    </span>
                                )}
                            </div>
                            {isDM && otherUser?.user?.online && (
                                <span className="text-xs text-green-600 font-medium">Online</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Members Count */}
                    <button
                        onClick={() => setShowMembers(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-gray-100 rounded-lg 
                     transition-colors group"
                        title="View members"
                    >
                        <UsersIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                            {memberCount}
                        </span>
                    </button>

                    {/* Video Call */}
                    <button
                        onClick={handleVideoCall}
                        className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Start Video Call"
                    >
                        <VideoIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                    </button>

                    {/* Pinned Messages */}
                    <button
                        onClick={handleShowPinned}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group relative"
                        title="Pinned Messages"
                    >
                        <PinIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                        {pinnedMessages.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 text-white 
                             text-[10px] rounded-full flex items-center justify-center font-bold">
                                {pinnedMessages.length}
                            </span>
                        )}
                    </button>

                    {/* Invite Button (Private Channels) */}
                    {channel.data?.private && (
                        <button
                            onClick={() => setShowInvite(true)}
                            className="ml-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 
                       text-white text-sm font-medium rounded-lg hover:shadow-lg 
                       hover:shadow-purple-500/25 transition-all duration-200
                       flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                            <UserPlusIcon className="w-4 h-4" />
                            Invite
                        </button>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showMembers && (
                <MembersModal
                    members={Object.values(channel.state.members)}
                    onClose={() => setShowMembers(false)}
                />
            )}

            {showPinnedMessages && (
                <PinnedMessagesModal
                    pinnedMessages={pinnedMessages}
                    onClose={() => setShowPinnedMessages(false)}
                />
            )}

            {showInvite && (
                <InviteModal
                    channel={channel}
                    onClose={() => setShowInvite(false)}
                />
            )}
        </>
    );
};

export default CustomChannelHeader;