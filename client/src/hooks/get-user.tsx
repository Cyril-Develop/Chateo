import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import { getUser } from "@/services/User";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";

const useGetUser = (userId: number | undefined) => {
  const { token, logout } = useUserStore((state) => state);

  const { isLoading, isError, data, error } = useQuery({
    enabled: !!userId,
    queryKey: ["user", userId],
    queryFn: async () => getUser(userId, token),
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
        logo: <Icons.alert />,
      });
      logout();
    }
  }, [isError, error, logout]);

  return { data, isLoading };
};

export default useGetUser;
