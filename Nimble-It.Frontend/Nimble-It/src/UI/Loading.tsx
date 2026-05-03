import { FourSquare } from "react-loading-indicators";

function Loading() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2">
      <FourSquare
        color="var(--background-color-primary)"
        size="medium"
        text=""
        textColor=""
      />
    </div>
  );
}

export default Loading;
