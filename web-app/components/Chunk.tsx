import { useState } from "react";

export const Chunk = ({ key, text }: { key: number; text: string }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div key={key} className="bg-slate-100 rounded p-2 rounded flex flex-col">
      <p>{expanded ? text : text.substring(0, 500)}</p>
      <button
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {!expanded && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        )}
        {expanded && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
