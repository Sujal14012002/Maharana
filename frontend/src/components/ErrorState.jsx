export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
      <p className="text-maroon-light text-lg font-display">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-2">
          Try Again
        </button>
      )}
    </div>
  );
}
