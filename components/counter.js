import { useState, useEffect } from "react";

const Counter = () => {
  const [tenthSeconds, setTenthSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTenthSeconds((tenthSeconds) => tenthSeconds + 1);
    }, 100); // now the interval is 100ms, so it increases every tenth of a second

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // passing an empty array as the second argument to useEffect makes it run only on mount and unmount

  return (
    <div>
      <time
        className="tabular-nums"
        dateTime={`PT${(tenthSeconds / 10).toFixed(1)}S`}
      >
        {(tenthSeconds / 10).toFixed(1)}s
      </time>
    </div>
  );
};

export default Counter;
