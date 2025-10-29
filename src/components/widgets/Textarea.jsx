import { forwardRef } from "react";

const TextArea = forwardRef(
  (
    {
      value = "",
      onChange,
      onScroll,
      placeholder = "",
      lineHeight = "1.5rem",
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onScroll={onScroll}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-full resize-none font-mono text-sm outline-none p-2 absolute inset-0 overflow-auto custom-scrollbar bg-[var(--bg-surface)] text-[var(--text)] ${className}`}
        style={{ lineHeight }}
        spellCheck={false}
        wrap="off"
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
