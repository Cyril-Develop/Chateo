import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserThumbnail from "@/components/user-thumbnail";
import useGetUsers from "@/hooks/get-users";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSocketStore } from "@/store/socket.store";
import { useSendRequestMutation } from "@/hooks/send-request";
import { useQueryClient } from "@tanstack/react-query";
import {
  FriendList,
  SearchUserProps,
  Users,
  UpdateRelationship,
} from "@/types/chat";

export const SearchUser = ({
  currentUser,
}: {
  currentUser: SearchUserProps;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<Users[]>([]);
  const { data } = useGetUsers();
  const userId = currentUser?.id;
  const sendRequestMutation = useSendRequestMutation();
  const { socket } = useSocketStore();
  const queryClient = useQueryClient();

  // Search for a user
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      setOpen(true);
      const filteredUsers = data?.filter((user: Users) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setContacts(filteredUsers || []);
    } else {
      setContacts([]);
    }
  };

  // Update the list after adding a friend
  const updateUserRelationship = (updatedData: UpdateRelationship) => {
    queryClient.setQueryData(["users"], (oldData: Users[] | undefined) => {
      if (!oldData) return oldData;

      return oldData.map((user) => {
        if (user.id === updatedData.user.id) {
          return { ...user, friends: [...user.friends, updatedData.friend] };
        }
        if (user.id === updatedData.friend.id) {
          return { ...user, friends: [...user.friends, updatedData.user] };
        }
        setQuery("");
        return user;
      });
    });

    // Invalidate the query to update the list
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  // Update the list after removing a friend
  const handleRemoveFriend = (removedData: UpdateRelationship) => {
    queryClient.setQueryData(["users"], (oldData: Users[] | undefined) => {
      if (!oldData) return oldData;

      return oldData.map((user) => {
        if (user.id === removedData.user.id) {
          return {
            ...user,
            friends: user.friends.filter((f) => f.id !== removedData.friend.id),
          };
        }
        if (user.id === removedData.friend.id) {
          return {
            ...user,
            friends: user.friends.filter((f) => f.id !== removedData.user.id),
          };
        }
        setQuery("");
        return user;
      });
    });

    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  useEffect(() => {
    socket?.on("updatedRelationship", updateUserRelationship);
    socket?.on("removedRelationship", handleRemoveFriend);

    return () => {
      socket?.off("updatedRelationship", updateUserRelationship);
      socket?.off("removedRelationship", handleRemoveFriend);
    };
  }, [socket, queryClient]);

  // Add a friend
  const handleAddFriend = (contactId: number) => {
    sendRequestMutation.mutate(contactId);
    setQuery("");
  };

  // Check if the user is a friend
  const isFriend = (friends: FriendList[]) => {
    return friends.some((friendList) => friendList.friend.id === userId);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-[200px] h-11 flex gap-2 items-center p-3 bg-background border border-input rounded-md">
          <Label htmlFor="searchUser">
            <Icons.search
              style={{ stroke: "#80838B" }}
              aria-label="Rechercher un contact"
            />
          </Label>
          <Input
            type="text"
            placeholder="Rechercher un contact"
            id="searchUser"
            value={query}
            onChange={handleSearch}
            className="flex h-auto rounded-md text-foreground p-0 text-sm outline-none border-none focus:border-none focus: placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </PopoverTrigger>
      {query.length >= 3 && (
        <PopoverContent
          className="w-[200px] p-0 border-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              {contacts.length === 0 && (
                <CommandEmpty>Aucun contact trouvé</CommandEmpty>
              )}
              {contacts.map(
                (contact) =>
                  contact.id !== userId && (
                    <CommandGroup className={cn("p-0")} key={contact.id}>
                      <CommandItem
                        value={contact.username}
                        className="flex items-center justify-between p-2 h-11"
                      >
                        <UserThumbnail
                          imageSize="8"
                          image={contact.profileImage}
                          username={contact.username}
                        />
                        {isFriend(contact.friends) ? (
                          <Icons.check width={16} height={16} />
                        ) : (
                          <Button
                            variant="linkForm"
                            title="Ajouter à la liste de contacts"
                            className="p-0"
                            onClick={() => handleAddFriend(contact.id)}
                          >
                            <Icons.add width={16} height={16} />
                          </Button>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};
