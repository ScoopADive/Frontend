// src/components/messages/MessageComposer.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import messageService from "../../services/messageService";

const TEMPLATE_PRESETS = {
  INVITE: "Hey, would you like to join a dive this weekend?",
  LOG_REQUEST: "Could you share your log details for this dive site?",
  SHORT_DM: "",
};

export default function MessageComposer({ isOpen, onClose, defaultReceiver }) {
  const [template, setTemplate] = useState("INVITE");
  const [content, setContent] = useState(TEMPLATE_PRESETS["INVITE"]);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);

  const receiverLabel = useMemo(() => {
    if (!defaultReceiver) return "-";
    return defaultReceiver.displayName || defaultReceiver.username || `#${defaultReceiver.id}`;
  }, [defaultReceiver]);

  useEffect(() => {
    if (isOpen) {
      setTemplate("INVITE");
      setContent(TEMPLATE_PRESETS["INVITE"]);
      setSending(false);
      setSentOk(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setContent(TEMPLATE_PRESETS[template] ?? "");
  }, [template]);

  const remain = 200 - String(content || "").length;

  const handleSend = async () => {
    if (!defaultReceiver) return;
    if (!content.trim()) return;
    try {
      setSending(true);
      await messageService.send({
        receiver: { id: defaultReceiver.id, username: defaultReceiver.username },
        content,
        template,
      });
      setSentOk(true);
      setTimeout(() => onClose?.(), 600);
    } catch {
      alert("Failed to send the message.");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
          <p className="text-sm text-gray-500">To: {receiverLabel}</p>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTemplate("INVITE")}
              className={`border rounded-md py-2 text-sm ${template === "INVITE" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              Invite Buddy
            </button>
            <button
              type="button"
              onClick={() => setTemplate("LOG_REQUEST")}
              className={`border rounded-md py-2 text-sm ${template === "LOG_REQUEST" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              Request Log
            </button>
            <button
              type="button"
              onClick={() => setTemplate("SHORT_DM")}
              className={`border rounded-md py-2 text-sm ${template === "SHORT_DM" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              Short DM
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 200))}
            className="w-full border border-gray-300 rounded-md p-3 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Type your message..."
          />
          <div className={`mt-1 text-xs ${remain < 0 ? "text-red-600" : "text-gray-500"}`}>
            {remain} characters left
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || content.trim().length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
          >
            {sending ? "Sending..." : sentOk ? "Sent" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

MessageComposer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  defaultReceiver: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    displayName: PropTypes.string,
  }),
};
