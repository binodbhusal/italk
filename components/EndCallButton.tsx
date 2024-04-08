'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const EndCallButton = () => {
  const router = useRouter();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isMeetingOwner = localParticipant
    && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;
  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        call.endCall();
        router.push('/');
      }}
      className="bg-red-500"
    >
      End meeting call
    </Button>
  );
};
export default EndCallButton;
