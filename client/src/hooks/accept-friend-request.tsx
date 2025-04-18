import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { useUserStore } from "@/store/user.store";
import { acceptFriendRequest } from "@/services/User";
import { handleTokenExpiration } from "@/utils/token-expiration";
import { useSocketStore } from "@/store/socket.store";

export const useAcceptFriendRequestMutation = () => {
  const { token, logout } = useUserStore((state) => state);
  const queryClient = useQueryClient();
  const { socket } = useSocketStore();

  return useMutation({
    mutationFn: (contactId: number) => acceptFriendRequest(contactId, token),
    onSuccess: (data) => {
      socket?.emit("updateRelationship", data);
      toast({
        title: data.message,
        variant: "success",
        logo: <Icons.check />,
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      if (error.message === "Token expiré !") {
        handleTokenExpiration(logout);
      }
    },
  });
};
