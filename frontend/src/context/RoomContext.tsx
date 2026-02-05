import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Room } from "@/types/Room";
import { getAllRooms } from "@/services/room/RoomService";

interface RoomContextValue {
  rooms: Room[];
  loading: boolean;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  getRoomById: (id: string) => Room | undefined;
  room: Room | null;
  setRoom: (room: Room | null) => void;
  refreshRooms: () => Promise<void>;
}

const RoomContext = createContext<RoomContextValue | undefined>(undefined);

interface RoomProviderProps {
  children: ReactNode;
}

export function RoomProvider({ children }: RoomProviderProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (!selectedRoomId) {
      setRoom(null);
      return;
    }

    const matchedRoom =
      rooms.find((item) => item.id === selectedRoomId) ?? null;
    setRoom(matchedRoom);
  }, [rooms, selectedRoomId]);

  const getRoomById = useCallback(
    (id: string): Room | undefined => rooms.find((room) => room.id === id),
    [rooms],
  );

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        selectedRoomId,
        setSelectedRoomId,
        getRoomById,
        room,
        setRoom,
        refreshRooms: loadRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom(): RoomContextValue {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
