type Props = {
  children: React.ReactNode;
};

export function DesktopOnly({ children }: Props) {
  return (
    <>
      <div className="md:hidden">
        Desktop only
      </div>
      <div className="hidden md:block w-full h-full">{children}</div>
    </>
  );
}
