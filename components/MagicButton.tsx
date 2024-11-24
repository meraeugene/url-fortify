import React from "react";

/**
 *  UI: border magic from tailwind css btns
 *  Link: https://ui.aceternity.com/components/tailwindcss-buttons
 *
 *  change border radius to rounded-lg
 *  add margin of md:mt-10
 *  remove focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50
 */
const MagicButton = ({
  title,
  icon,
  position,
  otherClasses,
  disabled,
  htmlFor,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  position: string;
  otherClasses?: string;
  disabled?: boolean;
  htmlFor?: string;
}) => {
  return htmlFor ? (
    <label
      htmlFor={htmlFor}
      className={`relative inline-flex h-12 w-full overflow-hidden p-[1px] focus:outline-none cursor-pointer ${otherClasses}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ED82_0%,#393BB2_50%,#00ED82_100%)]" />
      <span
        className={`inline-flex h-full w-full items-center justify-center bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2`}
      >
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </label>
  ) : (
    <button
      className={`relative inline-flex h-12 w-full overflow-hidden p-[1px] focus:outline-none ${otherClasses}`}
      disabled={disabled}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ED82_0%,#393BB2_50%,#00ED82_100%)]" />
      <span
        className={`inline-flex h-full w-full items-center justify-center bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2`}
      >
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;
