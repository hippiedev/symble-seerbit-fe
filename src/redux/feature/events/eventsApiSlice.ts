import { Event, EventRoom } from '../../../constants/types';
import { apiSlice } from '../../apiSlice';

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<{ message: string; data: Event[] }, undefined>({
      query: () => ({
        url: 'events?limit=1000&sortBy=name:asc',
        method: 'get',
      }),
      providesTags: ['Event'],
    }),
    startEvent: builder.mutation<{ message: string }, string>({
      query: (eventCode) => ({
        url: `events/${eventCode}/start`,
        method: 'post',
      }),
    }),
    endEvent: builder.mutation<{ message: string }, string>({
      query: (eventCode) => ({
        url: `events/${eventCode}/end`,
        method: 'post',
      }),
      invalidatesTags: ['Event', 'Wallet'],
    }),
    getPublicEvent: builder.query<Event, string>({
      query: (payload) => ({ url: `events/${payload}`, method: 'get' }),
      transformResponse: (response) =>
        (response as { message: string; data: Event }).data,
    }),
    createEvents: builder.mutation({
      query: (payload) => ({
        url: 'events/',
        method: 'post',
        data: { ...payload },
      }),
      invalidatesTags: ['Event', 'User'],
    }),
    cancelEvent: builder.mutation<{ message: string; data: Event }, string>({
      query: (eventId) => ({
        url: `account/event/${eventId}/cancel`,
        method: 'post',
      }),
      invalidatesTags: ['User', 'Event'],
    }),
    setEventToActive: builder.mutation<
      { message: string; data: Event },
      string
    >({
      query: (payload) => ({
        url: `events/${payload}`,
        method: 'post',
        data: { status: 'ACTIVE' },
      }),
      invalidatesTags: ['User', 'Event'],
    }),
    getEventRoom: builder.query<EventRoom, string>({
      query: (payload) => ({
        url: `events/${payload}/room`,
        method: 'get',
      }),
      transformResponse: (response) =>
        (
          response as {
            data: EventRoom;
          }
        ).data,
    }),
    eventRoomInteraction: builder.mutation<
      { message: string },
      { action: string; event_code: string }
    >({
      query: ({ action, event_code }) => ({
        url: `events/${event_code}/members`,
        params: { action },
        method: 'post',
      }),
    }),
    subscribeToEvent: builder.mutation<
      { message: string; data: { subscribed_events: string[] } },
      string
    >({
      query: (event_id) => ({
        url: `events/${event_id}/subscribe`,
        method: 'post',
      }),
      invalidatesTags: ['User'],
    }),
    sprayMoney: builder.mutation<
      { message: string },
      { sprayAmount: number; eventCode: string }
    >({
      query: ({ sprayAmount, eventCode }) => ({
        url: `events/${eventCode}/spray`,
        data: { amount: sprayAmount },
        method: 'post',
      }),
      invalidatesTags: ['Wallet', 'Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useStartEventMutation,
  useEndEventMutation,
  useCreateEventsMutation,
  useCancelEventMutation,
  useGetPublicEventQuery,
  useGetEventRoomQuery,
  useEventRoomInteractionMutation,
  useSetEventToActiveMutation,
  useSubscribeToEventMutation,
  useSprayMoneyMutation,
} = eventsApiSlice;
