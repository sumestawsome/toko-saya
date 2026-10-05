export default function ProductFilterBar({
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories = [],
}) {
    return (
        <div className="mb-6 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
            {/* 1. Bagian Kiri: Search Bar Terpadu (Input + Tombol Cari Menyatu Rapat) */}
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-stretch w-full md:max-w-md lg:max-w-lg"
            >
                <div className="relative flex-1 flex items-stretch">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Cari barangmu disini ..."
                        className="w-full bg-white border border-slate-300 border-r-0 px-4 py-2.5 pr-8 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] rounded-none transition font-sans"
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={() => setKeyword("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                            title="Hapus pencarian"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 rounded-none transition shrink-0 cursor-pointer border border-[#4F46E5]"
                >
                    <svg
                        className="w-4 h-4 text-white shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <span>Cari</span>
                </button>
            </form>

            {/* 2. Bagian Kanan: Dropdown Filters Terpisah */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Dropdown Kategori */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-none pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                        <option value="Semua">Semua Kategori</option>
                        {categories &&
                            categories.filter(Boolean).map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Dropdown Urutan */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-none pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                        <option value="default">Urutan Default</option>
                        <option value="lowest">Harga Termurah</option>
                        <option value="highest">Harga Termahal</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}