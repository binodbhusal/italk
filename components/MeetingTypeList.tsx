'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from '@/components/ui/use-toast';
import ReactDatePicker from 'react-datepicker';
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

function MeeetingTypeList() {
  const [meeting, setMeeting] = useState < 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!user || !client) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Failed to create meeting' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to  create call');
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({ title: 'Meeting created' });
    } catch (error) {
      toast({ title: 'Failed to create meeting' });
    }
  };
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeeting('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeeting('isScheduleMeeting')}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Checkout recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeeting('isJoiningMeeting')}
        className="bg-yellow-1"
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meeting === 'isScheduleMeeting'}
          onClose={() => setMeeting(undefined)}
          title="Create meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label htmlFor="" className="text-base text-normal leading-[22px]">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-2.5">
            <label htmlFor="datetime" className="text-base text-normal leading-[22px]">
              Select Date and Time
            </label>
            <ReactDatePicker
              id="datetime"
              className="bg-dark-2 w-full rounded p-2 focus:outline-none"
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"

            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meeting === 'isScheduleMeeting'}
          onClose={() => setMeeting(undefined)}
          title="Meeting created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link copied' });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />

      )}
      <MeetingModal
        isOpen={meeting === 'isInstantMeeting'}
        onClose={() => setMeeting(undefined)}
        title="Start a meeting"
        className="text-center"
        buttonText="Start meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meeting === 'isJoiningMeeting'}
        onClose={() => setMeeting(undefined)}
        title="Type the link"
        className="text-center"
        buttonText="Join meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          className="bg-dark-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
}
export default MeeetingTypeList;
