import { Link } from "react-router-dom";

const LinkButton = ({ children, to, className }: LinkButtonProps) => {
  return (
    <Link
      to={to}
      className={`border-primary text-primary hover:bg-primary bg-customWhite hover:text-customWhite flex h-12 items-center justify-center rounded-[9999px] border-2 px-6 font-semibold transition-colors md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 ${className}`}
    >
      {children}
    </Link>
  );
};

interface LinkButtonProps {
  children: React.ReactNode;
  to: string;
  className?: string;
}

export default LinkButton;
