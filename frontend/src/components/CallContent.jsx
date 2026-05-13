import { CallControls, SpeakerLayout, StreamTheme } from '@stream-io/video-react-sdk';

const CallContent = () => {
    const CallContent = () => {
        const { useCallCallingState } = useCallStateHooks();

        const callingState = useCallCallingState();
        const navigate = useNavigate();

        if (callingState === CallingState.LEFT) return navigate("/");


    };
    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    );
}

export default CallContent