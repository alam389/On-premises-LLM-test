import React from 'react';

const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Chat Page</h1>
        <p className="mt-2 text-muted-foreground">Barebones page</p>
      </div>
    </div>
  );
};

export default ChatPage;
