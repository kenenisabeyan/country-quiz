import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "../data/countryData";

export default function StudyDeckModal({
  isOpen,
  onClose,
  onSelectCountryToQuiz,
}) {
  const [search, setSearch] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [activeCountry, setActiveCountry] = useState(null);

  const continents = ["All", "Africa", "Asia", "Europe", "Americas", "Oceania"];

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) => {
      const matchesContinent =
        selectedContinent === "All" ||
        c.continent.toLowerCase() === selectedContinent.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.capital.toLowerCase().includes(search.toLowerCase()) ||
        (c.landmark && c.landmark.toLowerCase().includes(search.toLowerCase()));
      return matchesContinent && matchesSearch;
    });
  }, [search, selectedContinent]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#202446] border border-[#3E4577] text-white w-full max-w-3xl h-[85vh] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#3E4577]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <h2 className="text-2xl font-black">World Atlas & Study Deck</h2>
              </div>
              <p className="text-xs text-[#9DA3D1]">
                Browse, search, and master {COUNTRIES.length} nations across the globe
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Search & Continent Filters */}
          <div className="py-3 space-y-2.5">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search country, capital, or landmark..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181B38] border border-[#343B6D] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#BC6BE8]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {continents.map((continent) => (
                <button
                  key={continent}
                  onClick={() => setSelectedContinent(continent)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedContinent === continent
                      ? "bg-[#BC6BE8] border-[#BC6BE8] text-white shadow-sm"
                      : "bg-[#181B38] border-[#343B6D] text-[#8E97CF] hover:text-white"
                  }`}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>

          {/* Countries Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCountries.map((country) => (
              <div
                key={country.name}
                onClick={() => setActiveCountry(country)}
                className="bg-[#181B38] hover:bg-[#252A54] border border-[#32396B] hover:border-[#BC6BE8]/50 p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    alt={country.name}
                    className="w-10 h-7 rounded shadow border border-white/20 object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-white group-hover:text-[#BC6BE8] transition-colors truncate">
                      {country.name}
                    </p>
                    <p className="text-xs text-[#8E97CF] truncate">
                      🏛️ {country.capital}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#292F5C] flex justify-between items-center text-[10px] text-[#A0A5D0]">
                  <span>{country.continent}</span>
                  <span className="text-[#BC6BE8] font-semibold">View Details ➔</span>
                </div>
              </div>
            ))}

            {filteredCountries.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#8E97CF]">
                <p className="text-2xl mb-2">🌍</p>
                <p className="text-sm">No countries found matching your search.</p>
              </div>
            )}
          </div>

          {/* Quick Study / Quiz CTA */}
          <div className="pt-3 border-t border-[#3E4577] flex flex-wrap justify-between items-center gap-2">
            <span className="text-xs text-[#8E97CF]">
              Showing {filteredCountries.length} countries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSelectCountryToQuiz(selectedContinent);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:opacity-95 text-white cursor-pointer shadow-md"
              >
                🎯 Quiz Me on {selectedContinent === "All" ? "the World" : selectedContinent}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Selected Country Detail Modal inside Atlas */}
        {activeCountry && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#24284D] border border-[#444D87] text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#BC6BE8] bg-[#BC6BE8]/20 px-2 py-0.5 rounded-full">
                    {activeCountry.continent}
                  </span>
                  <h3 className="text-xl font-black mt-1 text-white">{activeCountry.name}</h3>
                </div>
                <button
                  onClick={() => setActiveCountry(null)}
                  className="text-gray-400 hover:text-white text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src={`https://flagcdn.com/w320/${activeCountry.code}.png`}
                  alt=""
                  className="h-24 rounded-xl shadow-lg border border-white/20 object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#181B38] p-2.5 rounded-xl border border-[#2E3566]">
                  <p className="text-[#8E97CF]">🏛️ Capital</p>
                  <p className="font-bold text-white mt-0.5">{activeCountry.capital}</p>
                </div>
                <div className="bg-[#181B38] p-2.5 rounded-xl border border-[#2E3566]">
                  <p className="text-[#8E97CF]">👥 Population</p>
                  <p className="font-bold text-white mt-0.5">{activeCountry.population}</p>
                </div>
                <div className="bg-[#181B38] p-2.5 rounded-xl border border-[#2E3566]">
                  <p className="text-[#8E97CF]">💵 Currency</p>
                  <p className="font-bold text-white mt-0.5">{activeCountry.currency}</p>
                </div>
                <div className="bg-[#181B38] p-2.5 rounded-xl border border-[#2E3566]">
                  <p className="text-[#8E97CF]">📍 Landmark</p>
                  <p className="font-bold text-white mt-0.5 truncate" title={activeCountry.landmark}>
                    {activeCountry.landmark}
                  </p>
                </div>
              </div>

              {activeCountry.funFact && (
                <div className="bg-[#BC6BE8]/15 border border-[#BC6BE8]/30 p-2.5 rounded-xl text-xs text-purple-200">
                  <span className="font-bold text-[#E65895]">💡 Fact: </span>
                  {activeCountry.funFact}
                </div>
              )}

              <button
                onClick={() => setActiveCountry(null)}
                className="w-full py-2.5 rounded-xl bg-[#373E73] hover:bg-[#485196] text-white font-bold text-xs cursor-pointer transition-all"
              >
                Close Fact Sheet
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
