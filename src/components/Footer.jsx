export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-6 py-6 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full">
      <div className="text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </div>
    </footer>
  );
};