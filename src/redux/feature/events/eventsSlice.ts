import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "../../../constants/types";

export interface EventState {
  eventData: {
    name: string;
    image: string;
    url: string;
    type: string;
    event_code: string;
    amount: number;
    participants: {}[];
    qrcode: string;
  } | null;
  message: string | null;
  subscribedEvents: string[] | [];
  showCreateEventsDrawer: boolean;
  liveSpraySettings:
    | {
        totalSprayAmount: number;
        numberOfSprays: number;
        singleSprayAmount: number;
      }
    | undefined;
}

const initialState: EventState = {
  eventData: null,
  message: null,
  showCreateEventsDrawer: false,
  liveSpraySettings: undefined,
  subscribedEvents: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setActiveEventData: (
      state,
      action: PayloadAction<{ message: string; data: Event }>
    ) => {
      state.eventData = action.payload?.data;
      state.message = action.payload?.message;
    },
    setShowCreateEventsDrawer: (state) => {
      state.showCreateEventsDrawer = true;
    },
    closeEventsDrawer: (state) => {
      state.showCreateEventsDrawer = false;
    },
    handleStartEvent: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message;
    },
    handleJoinEvent: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message;
    },
    handleSubscribedEvents: (state, action: PayloadAction<string[]>) => {
      state.subscribedEvents = action.payload;
    },
    handleSetSpraySettings: (
      state,
      action: PayloadAction<{
        totalSprayAmount: number;
        numberOfSprays: number;
        singleSprayAmount: number;
      } | undefined>
    ) => {
      state.liveSpraySettings = action.payload;
    },
  },
});

export const {
  setActiveEventData,
  setShowCreateEventsDrawer,
  closeEventsDrawer,
  handleStartEvent,
  handleJoinEvent,
  handleSetSpraySettings,
  handleSubscribedEvents,
} = eventsSlice.actions;

export default eventsSlice.reducer;
