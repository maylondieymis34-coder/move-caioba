
import React from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <ChatInterface />
      </main>
      
      {/* Footer Info (Optional Overlay or Sidebar) */}
      <footer className="hidden lg:block fixed bottom-4 left-4 text-xs text-slate-400 max-w-[200px]">
        Desenvolvido para fortalecer sua fé através de inteligência artificial fundamentada em princípios bíblicos.
      </footer>
    </div>
  );
};

export default App;
