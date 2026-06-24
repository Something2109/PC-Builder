import React from "react";

export const FormInputsEditor = ({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (newValue: Record<string, unknown>) => void;
}) => {
  const handleKeyChange = (oldKey: string, newKey: string) => {
    const updated: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === oldKey) {
        updated[newKey] = v;
      } else {
        updated[k] = v;
      }
    }
    onChange(updated);
  };

  const handleValueChange = (key: string, newVal: string) => {
    let parsedVal: unknown = newVal;
    try {
      const trimmed = newVal.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        parsedVal = JSON.parse(trimmed);
      }
    } catch {
      // Treat as string if JSON parsing fails
    }
    onChange({
      ...value,
      [key]: parsedVal,
    });
  };

  const handleDeleteKey = (keyToDelete: string) => {
    const updated = { ...value };
    delete updated[keyToDelete];
    onChange(updated);
  };

  const handleAddKey = () => {
    let newKey = "";
    let counter = 1;
    while (newKey in value) {
      newKey = `new_field_${counter}`;
      counter++;
    }
    onChange({
      ...value,
      [newKey]: "",
    });
  };

  return (
    <div className="flex flex-col gap-2 bg-slate-950/60 border border-slate-800 p-3 rounded-xl max-h-125 overflow-y-auto">
      <div className="grid grid-cols-12 gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider pb-1 border-b border-slate-900">
        <div className="col-span-4">Scraped Attribute Key</div>
        <div className="col-span-7">Scraped Value</div>
        <div className="col-span-1 text-center">Del</div>
      </div>
      <div className="space-y-2">
        {Object.entries(value).map(([key, val], idx) => {
          const displayVal =
            typeof val === "object" && val !== null ? JSON.stringify(val, null, 2) : String(val);
          return (
            <div key={key || idx} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-4">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleKeyChange(key, e.target.value)}
                  placeholder="Key"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="col-span-7">
                <textarea
                  value={displayVal}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                  placeholder="Value string or JSON object"
                  rows={1}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans min-h-8.5 resize-y"
                />
              </div>
              <div className="col-span-1 flex justify-center pt-1.5">
                <button
                  type="button"
                  onClick={() => handleDeleteKey(key)}
                  className="text-rose-500 hover:text-rose-400 cursor-pointer p-0.5"
                  title="Delete Field"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleAddKey}
        className="w-full py-1.5 border border-dashed border-slate-800 hover:border-slate-700 rounded-lg text-[10px] text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1.5 mt-2 transition-colors cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Custom Scraped Field
      </button>
    </div>
  );
};
