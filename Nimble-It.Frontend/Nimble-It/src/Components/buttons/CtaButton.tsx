function CtaButton({ children, className, onClick }: CtaButtonProps) {
  return (
    <button
      type="button"
      className={`bg-primary border-bg text-customWhite h-12 cursor-pointer rounded-[9999px] border-2 px-6 font-semibold md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface CtaButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default CtaButton;
