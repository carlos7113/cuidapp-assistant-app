import { supabase } from '../../lib/supabaseClient';

export interface RealtimeTripPayload {
  type: 'NEW_TRIP_REQUEST' | 'TRIP_ACCEPTED' | 'TRIP_STATUS_CHANGED';
  data: any;
}

class TripRealtimeService {
  private channelName = 'trip_updates';
  private channel = supabase.channel(this.channelName);

  constructor() {
    this.channel.subscribe((status) => {
      console.log(`📡 [RealtimeService] Channel status: ${status}`);
    });
  }

  public broadcastTripRequest(tripData: any) {
    console.log('📡 [RealtimeService] Broadcasting trip request');
    return this.channel.send({
      type: 'broadcast',
      event: 'trip_event',
      payload: {
        type: 'NEW_TRIP_REQUEST',
        data: tripData
      }
    });
  }

  public broadcastTripAccepted(tripData: any) {
    console.log('📡 [RealtimeService] Broadcasting trip accepted');
    return this.channel.send({
      type: 'broadcast',
      event: 'trip_event',
      payload: {
        type: 'TRIP_ACCEPTED',
        data: tripData
      }
    });
  }

  public subscribeToTrips(callback: (payload: RealtimeTripPayload) => void) {
    console.log('📡 [RealtimeService] Subscribing to trip events');
    const subscription = supabase.channel(this.channelName)
      .on('broadcast', { event: 'trip_event' }, (payload) => {
        console.log('📡 [RealtimeService] Event received:', payload);
        if (payload.payload) {
          callback(payload.payload as RealtimeTripPayload);
        }
      })
      .subscribe();

    return () => {
      console.log('📡 [RealtimeService] Unsubscribing');
      supabase.removeChannel(subscription);
    };
  }
}

export const tripRealtimeService = new TripRealtimeService();
