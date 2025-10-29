import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="px-4 py-2 flex justify-between items-center max-w-full overflow-x-hidden">
          <h1 className="text-2xl font-bold">JSON Tree Visualizer</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden">
      </main>
    </div>
  );
}

export default App;
