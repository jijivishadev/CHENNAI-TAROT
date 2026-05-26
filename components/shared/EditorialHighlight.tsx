import React, { useRef, useEffect, useState } from "react";

interface EditorialHighlightProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const EditorialHighlight: React.FC<EditorialHighlightProps> = ({
  children,
  className = "",
  animate = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animate) {
      setVisible(true);
      return;
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span
      ref={ref}
      className={`editorial-highlight ${visible ? "draw-in" : ""} ${className}`.trim()}
      style={{
        display: "inline-block",
        background: "rgba(212, 175, 55, 0.15)",
        padding: "0.1em 0.3em 0.15em 0.3em",
        borderRadius: "0.25em",
        transform: "skewX(-8deg)",
        transition: animate ? "background-size 0.7s cubic-bezier(.77,0,.18,1)" : undefined,
        backgroundSize: visible ? "100% 100%" : "0% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        boxDecorationBreak: "clone",
      }}
    >
      <span style={{ display: "inline-block", transform: "skewX(8deg)" }}>{children}</span>
    </span>
  );
};
