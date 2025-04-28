import { transform } from "next/dist/build/swc/generated-native";
import supabase from "./supabaseClient";
import { DashboardEvent, EventFormData } from "@/types/event"
import { title } from "process";

//Events table representing the structure of the events in the database

interface EventTable {
    id: string;
    title: string;
    location: string;
    location_coordinates: any;
    description: string | null;
    start_time: string;
    end_time: string;
    organizer_id: string;
    max_attendees: number;
    status: "available" | "starting soon" | "cancelled";
    is_public: boolean;
    food_offerings: any;
    created_at: string;
    updated_at: string;
}

export async function fetchPublicEvents() {
    const { data, error } = await supabase
        .from("events")
        .select(`*, profiles:organizer_id (name,email)`)
        .eq("is_public", true)
        .eq("status", "available")
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Error fetching public events:", error);
        throw error;
    }

    return transformEvents(data || []);
}

export async function getUserRsvp(userId: string) {
    const { data, error } = await supabase
        .from("event_attendees")
        .select(`event_id, 
            events:event_id (*, 
            profiles:organizer_id (name, email))`)
        .eq("user_id", userId);

    if (error) {
        console.error("Unable to fetch user RSVP events:", error);
        throw error;
    }

    const eventRecords = data?.map(item => item.events) || [];
    return transformEvents(eventRecords);
}

    //Creating a new event
    export async function createEvent(eventData: EventFormData, userId: string) {
        //takes in the form data turns it into database format
        const eventRecord = {
            title: eventData.title,
            location: eventData.location.name,
            location_coordinates: `(${eventData.location.coordinates[0]}, ${eventData.location.coordinates[1]})`,
            start_time: eventData.startDateTime.toISOString(), //Referenced ChatGPT
            end_time: eventData.endDateTime.toISOString(),
            organizer_id: userId,
            max_attendees: eventData.maxAttendees || null,
            status: "available",
            is_public: eventData.isPublic,
            food_offerings: eventData.foodOfferings
        };

        // Inserting the event into the database
        const {data, error} = await supabase
        .from ("events")
        .insert(eventRecord)
        .select()
        .single();

        if (error) {
            console.error("Unable to create event:", error);
            throw error;
        }
        return data;
    }

    export async function rsvpToEvent(eventId: string, userId: string) {
        const {data: eventData, error:eventError} = await supabase
        .from("events")
        .select(`
            id,
            max_attendees,
            event_attendees:event_attendees(count)
            `)
            .eq("id", eventId)
            .single();

        if (eventError) {
            console.error("Unable to fetch event details:", eventError);
            throw eventError;
        }

        //Checks current attendee count
        const currentAttendeeCount = eventData?.event_attendees[0]?.count || 0;

        //Checks if the event is full
        if (eventData?.max_attendees !== null && currentAttendeeCount >= eventData.max_attendees) {
            throw new Error("Event is full");
        }

        const {error} = await supabase
        .from("event_attendees")
        .insert({
            event_id: eventId,
            user_id: userId,
            rsvp_time: new Date().toISOString()
        });

        if (error) {
            console.error("Error RSVPing to event:", error);
            throw error;
        }

        return true;
    }

    export async function cancelRsvp(eventId: string, userId: string) {
        const {error} = await supabase
            .from("event_attendees")
            .delete()
            .eq("event_id", eventId)
            .eq("user_id", userId);

            if (error) {
                console.error("Error cancelling RSVP:", error);
                throw error;
            }

            return true;
        }

        function transformEvents(records: any []) : DashboardEvent[] {
            return records.map((record) => {
                let coords: [number, number] = [-71.1097, 42.3505]; //BU coordinates
                if (record.location_coordinates) {
                    // Remove parentheses and split by comma
                    const coordString = record.location_coordinates.replace(/[()]/g, '');
                    const [lng, lat] = coordString.split(',').map(Number);
                    coords = [lng, lat];
                }

                const startTime = new Date(record.start_time);
                const endTime = new Date(record.end_time);
                const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

                return {
                    id: record.id,
                    title: record.title,
                    location: record.location,
                    time: timeRange,
                    attendees: Array.isArray(record.event_attendees) 
                        ? record.event_attendees.length 
                        : (record.event_attendees?.count || 0),
                    status: record.status,
                    coords: coords,
                    description: record.description || "",
                    foodOfferings: record.food_offerings || [],
                    organizerName: record.profiles?.name || "",
                    organizerEmail: record.profiles?.email || "",
                    maxAttendees: record.max_attendees,
                    isPublic: record.is_public,
                };
            });
        }

        //Helper function to format time
        function formatTime(data: Date): string {
            return data.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
        }
