import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { deleteRoom } from "@/services/Chat";
import { handleTokenExpiration } from "@/utils/token-expiration";
import { useSocketStore } from "@/store/socket.store";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";

export const useDeleteRoomMutation = () => {
  const { token, logout } = useUserStore((state) => state);
  const { socket } = useSocketStore();

  return useMutation({
    mutationFn: (roomId: number) => deleteRoom(roomId, token),
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
        logo: <Icons.check />,
      });
      socket?.emit("deleteRoom", data.roomId);
    },
    onError: (error) => {
      if (error.message === "Token expiré !") {
        handleTokenExpiration(logout);
      }
    },
  });
};
