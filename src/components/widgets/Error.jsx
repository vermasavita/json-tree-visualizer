const Error = ({ title = "Error", error }) => {
  if (!error) return null;

  return (
    <div
      className="p-3 border-t rounded-sm"
      style={{
        backgroundColor: "color-mix(in srgb, var(--danger) 10%, transparent)",
        borderColor: "var(--danger)",
        color: "var(--danger)"
      }}
    >
      <div className="flex items-start space-x-2">
        <span className="text-xs">⚠</span>
        <div>
          <p className="font-semibold text-xs">{title}</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default Error;
