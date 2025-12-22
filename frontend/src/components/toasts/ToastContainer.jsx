import React from "react";
import { useToast } from "./ToastContext";
import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{
        zIndex: 11000,
        pointerEvents: "none",
        maxWidth: "350px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{ pointerEvents: "auto", marginBottom: "0.5rem" }}
        >
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
