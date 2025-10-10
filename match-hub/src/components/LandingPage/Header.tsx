import { Button } from "../ui/button";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between max-w-7xl mx-auto py-12">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent ml-4 md:ml-8">
        MatchHub
      </h1>
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 h-12 rounded-full cursor-pointer font-semibold hover:shadow-lg hover:scale-105 transition-all mr-4 md:mr-8">
        Get Started
      </Button>
    </nav>
  );
}