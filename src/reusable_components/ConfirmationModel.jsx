import React from 'react'
import { toast } from "react-toastify";
import {
  User,
  Landmark,
  CheckCircle,
  Clock,
  Pencil,
  Trash2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }){
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Trash2 className="text-red-600" size={22} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border text-gray-600 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
