import JSONTreeVisualizer from "./components/JSONTreeVisualizer";
import ThemeToggle from "./components/ThemeToggle";
import Typography from "./components/widgets/Typography";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="px-4 py-2 flex justify-between items-center max-w-full overflow-x-hidden">
          <Typography variant="h2" className="font-semibold">
            JSON Tree Visualizer
          </Typography>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden">
        <JSONTreeVisualizer />
      </main>
    </div>
  );
}

export default App;
