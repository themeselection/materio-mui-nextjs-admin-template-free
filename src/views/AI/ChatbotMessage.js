import React from 'react';

const ChatbotMessage = ({ text, isUserMessage }) => {
  const messageClass = isUserMessage ? 'user-message' : 'chatbot-message';
  return (
    <div className={`chat-message ${messageClass}`}>
      <div className="message-text">{text}</div>
    </div>
  );
};

export default ChatbotMessage;
