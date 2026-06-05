import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { NotificationContextType } from "../types/NotificationType";

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification deve ser usado dentro de NotificationProvider");
  }
  return context;
}
