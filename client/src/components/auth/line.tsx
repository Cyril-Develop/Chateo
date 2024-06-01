const line = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center uppercase">
        <span className="bg-background dark:bg-primary-foreground px-2 text-muted-foreground font-semibold text-m">
          OU
        </span>
      </div>
    </div>
  );
};

export default line;
