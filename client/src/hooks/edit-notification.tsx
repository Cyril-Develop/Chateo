import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { useUserStore } from "@/store/user.store";
import { editNotification } from "@/services/User";
import expiredToken from "@/utils/expired-token";

export const useEditNotificationMutation = () => {
  const { token, logout } = useUserStore((state) => state);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: string) =>
      editNotification(notification, token || ""),
    onSuccess: () => {
      toast({
        title: "Changement pris en compte !",
        variant: "success",
        logo: <Icons.check/>,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      if (error.message === "Token expiré !") {
        expiredToken(logout);
      } else {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
          logo: <Icons.alert/>,
        });
      }
    },
  });
};
