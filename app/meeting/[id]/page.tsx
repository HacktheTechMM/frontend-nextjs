'use client';

import { useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function MeetingPage({ params }: { params: { id: string } }) {
    useEffect(() => {
        const appID = 1182505731;
        const serverSecret = "20a1640a2b7914d1551a3681ce012241";
        const roomID = params.id;
        const userID = "user_" + Math.floor(Math.random() * 10000);
        const userName = "Guest";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: document.getElementById("video-container")!,
            sharedLinks: [
                {
                    name: "Meeting Link",
                    url: window.location.href,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            showPreJoinView: false,

        });
    }, [params.id]);

    return (
        <div id="video-container" style={{ width: '100vw', height: '100vh' }} />
    );
}
