import { useMemo, useCallback, useRef, forwardRef, useEffect } from "react";
import Button from "./widgets/Button";
import Error from "./widgets/Error";
import Typography from "./widgets/Typography";
import TextArea from "./widgets/Textarea";

const EditorHeader = ({ title = "JSON", buttons = [] }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-[var(--danger)]"></div>
        <div className="w-3 h-3 rounded-full bg-[var(--warning)]"></div>
        <div className="w-3 h-3 rounded-full bg-[var(--success)]"></div>
        <Typography variant="h6">{title}</Typography>
      </div>

      <div className="flex space-x-2">
        {buttons.map((button, index) => (
          <Button
            key={button.id || index}
            size="xs"
            onClick={button.onClick}
            variant={button.variant}
            disabled={button.disabled}
            title={button.title}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const LineNumbers = forwardRef(({ lineNumbers = [], className = "" }, ref) => {
  return (
    <div
      ref={ref}
      className={`py-2 px-3 text-right select-none font-mono text-sm overflow-y-auto custom-scrollbar border-r ${className}`}
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
        color: "var(--text-muted, #6b7280)"
      }}
    >
      {lineNumbers.map((num) => (
        <div key={num} className="leading-6">
          {num}
        </div>
      ))}
    </div>
  );
});

LineNumbers.displayName = "LineNumbers";

const StatusBar = ({ language = "JSON", encoding = "UTF-8" }) => {
  return (
    <div
      className="px-4 py-1 text-xs flex justify-between items-center border-t rounded-sm"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    >
      <div className="flex space-x-4">
        <Typography variant="small">{encoding}</Typography>
        <Typography variant="small">{language}</Typography>
      </div>
    </div>
  );
};

const JSONEditor = ({
  value = "",
  onChange,
  onVisualize,
  error = null,
  onLoadSample,
  onFormat,
  onClear,
  language = "JSON",
  placeholder = '{\n  "key": "value"\n}',
  visualizeButtonText = "Visualize JSON Tree",
  visualizeButtonIcon = "🌳",
  showVisualizeButton = true,
  headerButtons = [],
  readOnly = false,
  className = ""
}) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lineNumbers = useMemo(() => {
    const lines = value ? value.split("\n").length : 1;
    return Array.from({ length: Math.max(1, lines) }, (_, i) => i + 1);
  }, [value]);

  const handleScroll = useCallback((e) => {
    if (lineNumbersRef.current && textareaRef.current) {
      const scrollTop = e.target.scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("scroll", handleScroll);
      return () => textarea.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleChange = useCallback(
    (e) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleVisualize = useCallback(() => {
    if (onVisualize && value.trim()) {
      onVisualize(value);
    }
  }, [onVisualize, value]);

  const hasData = useMemo(() => {
    return value && value.trim().length > 0;
  }, [value]);

  const defaultButtons = useMemo(
    () =>
      [
        onLoadSample && {
          id: "load-sample",
          label: "Load Sample",
          onClick: onLoadSample,
          variant: "secondary",
          title: "Load sample JSON data",
          disabled: false
        },
        onFormat && {
          id: "format",
          label: "Format",
          onClick: onFormat,
          variant: "success",
          title: "Format JSON",
          disabled: !hasData
        },
        onClear && {
          id: "clear",
          label: "Clear",
          onClick: onClear,
          variant: "danger",
          title: "Clear editor",
          disabled: !hasData
        }
      ].filter(Boolean),
    [onLoadSample, onFormat, onClear, hasData]
  );

  const buttons = headerButtons.length > 0 ? headerButtons : defaultButtons;

  return (
    <div
      className={`flex flex-col h-full overflow-hidden  bg-[var(--bg-surface)] ${className}`}
    >
      <EditorHeader
        title={language}
        buttons={buttons.map((btn) => ({
          ...btn,
          disabled: btn.disabled || readOnly
        }))}
      />

      <div className="flex flex-1 overflow-hidden">
        <LineNumbers
          ref={lineNumbersRef}
          lineNumbers={lineNumbers}
          className="flex-shrink-0"
        />

        <div className="flex-1 relative min-w-0">
          <TextArea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onScroll={handleScroll}
            placeholder={placeholder}
            disabled={readOnly}
            aria-label="JSON editor"
            className="absolute inset-0"
            style={{
              lineHeight: "1.5rem",
              fontFamily: "monospace"
            }}
          />
        </div>
      </div>

      <StatusBar language={language} lineCount={lineNumbers.length} />

      {error && <Error title="Invalid JSON" error={error} />}

      {showVisualizeButton && (
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
          <Button
            onClick={handleVisualize}
            disabled={!hasData || readOnly}
            className="w-full justify-center"
            aria-label={visualizeButtonText}
          >
            <span>{visualizeButtonIcon}</span>
            <span>{visualizeButtonText}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default JSONEditor;
