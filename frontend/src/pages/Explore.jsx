import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { ALL_SCHEMES, CATEGORIES } from "../data/mockdata";
import SchemeCard from "../components/schemecard";

export default function Explore() {
  // URL se search param uthana
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");

  // Agar URL change ho, toh input update ho jaye
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val) {
      setSearchParams({ q: val }); // URL update karo
    } else {
      setSearchParams({}); // URL se query hatao
    }
  };

  // Filter Logic
  const filtered = useMemo(() => {
    return ALL_SCHEMES.filter((s) => {
      const matchesCategory = category === "all" || s.category === category;
      const matchesQuery = 
        !query || 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.benefit.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase());
      
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-blue mb-2">Explore Government Schemes</h1>
        <p className="text-gray-600">Discover schemes you are eligible for across all categories.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                category === c.id 
                  ? "bg-gov-blue text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Local Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search schemes, benefits..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-gov-blue"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} {query && `for "${query}"`}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((scheme, i) => (
            <SchemeCard key={scheme.id} scheme={scheme} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-md border border-gray-200 border-dashed">
          <Search size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No schemes found</h3>
          <p className="text-gray-500 mt-1">Try searching with different keywords or categories.</p>
        </div>
      )}

    </div>
  );
}