import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/user.store";
import { editAccount } from "@/services/User";
import { Icons } from "@/components/Icons";
import { handleTokenExpiration } from "@/utils/token-expiration";

export const useEditAccountMutation = () => {
  const { token, logout } = useUserStore((state) => state);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => editAccount(email, token),
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
        logo: <Icons.check />,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      if (error.message === "Token expiré !") {
        handleTokenExpiration(logout);
      }
    },
  });
};
