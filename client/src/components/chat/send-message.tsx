import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleKeydown, handleLabelClick } from "@/utils/handle-input-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessageFormSchema } from "@/schema/main";

interface MessageFormProps {
  message: string;
  file: File | null;
}

const SendMessage = () => {
  const [openEmoji, setOpenEmoji] = useState(false);

  const form = useForm<MessageFormProps>({
    resolver: zodResolver(MessageFormSchema),
    defaultValues: {
      message: "",
      file: null,
    },
  });

  interface EmojiObject {
    emoji: string;
  }

  const handleEmojiClick = (emojiObject: EmojiObject) => {
    form.setValue("message", form.getValues("message") + emojiObject.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      form.setValue("file", e.target.files[0]);
    }
  };

  const onSubmit = (data: MessageFormProps) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <Separator />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 mt-4 mb-4 relative"
      >
        {openEmoji && (
          <div className="absolute bottom-full right-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Message..."
                  aria-label="Envoyer un message"
                />
              </FormControl>
              <FormDescription>
                Appuyez sur la touche "Entrée" pour envoyer votre message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-8 bg-primary text-primary-foreground hover:bg-primary/80 h-11 w-11 cursor-pointer"
                tabIndex={0}
                aria-label="Joindre un fichier"
                onKeyDown={handleKeydown}
                onClick={() => handleLabelClick("fileInput")}
              >
                <Icons.paperClip />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden"
                  value={undefined}
                  onChange={handleFileChange}
                  id="fileInput"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          size="message"
          onClick={() => setOpenEmoji(!openEmoji)}
        >
          <Icons.emoji
            aria-label={openEmoji ? "Fermer les emojis" : "Ouvrir les emojis"}
          />
        </Button>
        <Button type="submit" size="message">
          <Icons.send aria-label="Envoyer" />
        </Button>
      </form>
    </Form>
  );
};

export default SendMessage;
