import React, { useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);

  const fetchContributions = async () => {
    setLoading(true);
    setContributions([]);
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}`
      );

      if (!res.ok) {
        throw new Error("GitHub user not found or API error.");
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.contributions)) {
        throw new Error("Invalid API response.");
      }

      const flatData = data.contributions.flatMap((week: any) =>
        Array.isArray(week.days)
          ? week.days.map((day: any) => ({
              date: day.date,
              count: day.count,
              color: day.color,
            }))
          : []
      );

      if (flatData.length === 0) {
        throw new Error("No contribution data found.");
      }

      setContributions(flatData);
    } catch (err: any) {
      console.error("FETCH ERROR:", err.message);
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-800 text-white p-8 font-sans">
      <h1 className="text-5xl font-bold text-center mb-6 drop-shadow-xl">
        GitPortfolio Art Generator
      </h1>

      <div className="max-w-lg mx-auto text-center mb-10">
        <p className="mb-4 text-gray-300">
          🎨 Enter your GitHub username and turn your commits into a beautiful piece of visual art.
        </p>
        <input
          type="text"
          placeholder="e.g., torvalds"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded text-black mb-4"
        />
        <button
          onClick={fetchContributions}
          disabled={loading || !username.trim()}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-semibold shadow"
        >
          {loading ? "Loading..." : "Generate Art"}
        </button>
      </div>

      {contributions.length > 0 && (
        <div className="grid grid-cols-7 gap-1 justify-center">
          {contributions.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date} - ${day.count} contributions`}
              className="w-4 h-4 rounded-sm transition-transform duration-300 transform hover:scale-125"
              style={{ backgroundColor: day.color }}
            ></div>
          ))}
        </div>
      )}

      {contributions.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-10">
          No data yet. Enter a GitHub username and generate your art.
        </div>
      )}

      <footer className="mt-16 text-center text-sm text-gray-500">
        Built with ❤️ using React + Tailwind · Powered by GitHub Contributions API
      </footer>
    </div>
  );
};

export default Home;
