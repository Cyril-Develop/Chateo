interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl text-center font-semibold sm:text-4xl">{title}</h1>
      <p className="text-lg text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default AuthHeader;
