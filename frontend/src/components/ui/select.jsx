import * as React from "react";

export const Select = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className }) => {
  return (
    <div
      className={`w-full rounded-md border px-3 py-2 text-sm cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ children, className, onValueChange }) => {
  return (
    <div className={`mt-1 rounded-md border shadow-lg ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { onValueChange })
      )}
    </div>
  );
};

export const SelectItem = ({ value, children, onValueChange, className }) => {
  return (
    <div
      onClick={() => onValueChange(value)}
      className={`px-3 py-2 cursor-pointer hover:bg-cyan-400/10 ${className}`}
    >
      {children}
    </div>
  );
};