import React, { useState, useRef, useEffect } from "react";

type TruncateTextProps = {
  content?: string;
  wordLimit: number;
  className: string;
};

export const TruncateText: React.FC<TruncateTextProps> = ({
  content = "",
  wordLimit,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
  //     setIsExpanded(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const renderContent = () => {
    const words = content.split(" ");
    if (words.length > wordLimit && !isExpanded) {
      return `${words.slice(0, wordLimit).join(" ")}... `;
    }
    return content;
  };

  return (
    // <div ref={containerRef}>
    <p className={className}>
      {renderContent()}
      {content.split(" ").length > wordLimit && (
        <span
          style={{ color: "#8b8d8d", cursor: "pointer" }}
          onClick={handleToggle}
        >
          {isExpanded ? "" : "See more"}
        </span>
      )}
    </p>
    // </div>
  );
};
