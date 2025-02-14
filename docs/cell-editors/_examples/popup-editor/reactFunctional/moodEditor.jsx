import React, { memo, useEffect, useRef, useState } from "react";

export default memo(({ value, onValueChange, stopEditing }) => {
  const isHappy = (value) => value === "Happy";

  const [ready, setReady] = useState(false);
  const refContainer = useRef(null);

  const checkAndToggleMoodIfLeftRight = (event) => {
    if (ready) {
      if (["ArrowLeft", "ArrowRight"].indexOf(event.key) > -1) {
        // left and right
        const isLeft = event.key === "ArrowLeft";
        onValueChange(isLeft ? "Happy" : "Sad");
        event.stopPropagation();
      }
    }
  };

  useEffect(() => {
    refContainer.current.focus();
    setReady(true);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", checkAndToggleMoodIfLeftRight);

    return () => {
      window.removeEventListener("keydown", checkAndToggleMoodIfLeftRight);
    };
  }, [checkAndToggleMoodIfLeftRight, ready]);

  const onClick = (happy) => {
    onValueChange(happy ? "Happy" : "Sad");
    stopEditing();
  };

  const happyClass = isHappy(value) ? "selected" : "default";
  const sadClass = !isHappy(value) ? "selected" : "default";

  return (
    <div
      ref={refContainer}
      className={"mood"}
      tabIndex={0} // important - without this the key presses wont be caught
    >
      <img
        src="https://www.ag-grid.com/example-assets/smileys/happy.png"
        onClick={() => onClick(true)}
        className={happyClass}
      />
      <img
        src="https://www.ag-grid.com/example-assets/smileys/sad.png"
        onClick={() => onClick(false)}
        className={sadClass}
      />
    </div>
  );
});
