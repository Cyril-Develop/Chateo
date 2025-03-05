import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { useUserStore } from "@/store/user.store";
import { leaveRoom } from "@/services/Chat";
import { useSocketStore } from "@/store/socket.store";
import { getUserId } from "@/utils/get-userId";
import { useRoomStore } from "@/store/room.store";
import { useHandleTokenExpiration } from "@/hooks/handle-token-expiration";

export const useLeaveRoomMutation = () => {
  const { token } = useUserStore((state) => state);
  const { socket } = useSocketStore();
  const { setRoom } = useRoomStore();
  const userId = getUserId();
  const handleExpiration = useHandleTokenExpiration();

  return useMutation({
    mutationFn: (roomId: number) => leaveRoom(roomId, token),
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
        logo: <Icons.check />,
      });
      socket?.emit("leaveRoom", data.roomId, userId);
      setRoom(null);
    },
    onError: (error) => {
      if (error.message === "Session expirée, veuillez vous reconnecter") {
        handleExpiration();
      }
    },
  });
};
