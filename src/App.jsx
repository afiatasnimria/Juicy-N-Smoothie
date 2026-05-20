import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Clock, Phone, Facebook, Instagram, Twitter, Menu, X, ChevronDown, Edit3, Save, XCircle, ExternalLink, Linkedin } from 'lucide-react'
import defaultData, { getData, saveData, resetData, getDataUrl, setDataUrl, exportDataAsJson } from './data'

function App() {
  const [data, setData] = useState(getData)
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminTab, setAdminTab] = useState('menu')
  const [editItem, setEditItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('jns_theme')
    if (savedTheme === 'dark') setDarkMode(true)
    const dataUrl = getDataUrl()
    if (dataUrl) {
      fetch(dataUrl)
        .then(res => { if (!res.ok) throw new Error('Fetch failed'); return res.json() })
        .then(remote => {
          const merged = { ...defaultData, ...remote, menu: remote.menu || defaultData.menu, categories: remote.categories || defaultData.categories }
          setData(merged)
        })
        .catch(() => { /* fallback to local/default data */ })
    }
    setTimeout(() => setLoading(false), 1500)
  }, [])

  useEffect(() => {
    const handleContext = (e) => { e.preventDefault(); return false }
    document.addEventListener('contextmenu', handleContext)
    console.log('%c⚠️ SabrWare Protected', 'font-size:24px;font-weight:bold;color:#74a892')
    console.log('%cThis application is protected by SabrWare. Unauthorized copying is prohibited.', 'font-size:14px;color:#888')
    return () => document.removeEventListener('contextmenu', handleContext)
  }, [])

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('jns_theme', 'dark') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('jns_theme', 'light') }
  }, [darkMode])

  const saveSiteData = (newData) => {
    setData(newData)
    saveData(newData)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#FAFBF7] dark:bg-[#0f231a] transition-colors duration-300">
      <Navbar
        darkMode={darkMode} setDarkMode={setDarkMode}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        data={data}
      />
      <main>
        <HeroSection data={data} />
        <div className="hidden md:block">
          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={data.categories} />
        </div>
        <MenuSection activeCategory={activeCategory} searchQuery={searchQuery} menu={data.menu} categories={data.categories} />
        {data.todayOffer.enabled && <SpecialOffer offer={data.todayOffer} />}
        <AboutSection data={data} />
        <ContactSection data={data} />
      </main>
      <Footer data={data} onAdminClick={() => setAdminOpen(true)} />
      <MobileBottomNav />
      <div className="h-20 md:hidden" />
      {adminOpen && (
        <AdminPanel
          data={data} onSave={saveSiteData} onClose={() => setAdminOpen(false)}
          tab={adminTab} setTab={setAdminTab} editItem={editItem} setEditItem={setEditItem}
        />
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }} animate={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFBF7] dark:bg-[#0f231a]"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl mb-6">🍹</motion.div>
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-[#74a892] to-[#e8c88a]" />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 text-gray-500 font-medium">Loading deliciousness...</motion.p>
    </motion.div>
  )
}

function Navbar({ darkMode, setDarkMode, searchQuery, setSearchQuery, mobileMenuOpen, setMobileMenuOpen, activeCategory, setActiveCategory, data }) {
  const [scrolled, setScrolled] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (value.trim()) {
      const matches = data.menu
        .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 8)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (name) => {
    setSearchQuery(name)
    setShowSuggestions(false)
    setMobileMenuOpen(false)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const categoryLinks = data.categories.filter(c => c.id !== 'all').map(c => ({
    href: '#menu', label: c.name, icon: c.icon, action: () => {
      setActiveCategory(c.id)
      setShowSuggestions(false)
    }
  }))



  const inputClasses = "w-full px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#1a2e25]/80 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-[#74a892] transition-all text-sm"

  return (
    <motion.nav
      initial={{ y: -100 }} animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-3xl md:text-4xl">🍹</span>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-[#2d4a3e] dark:text-white">{data.restaurant.name}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">Digital Menu</p>
            </div>
          </motion.div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => { setSearchFocused(true); if (suggestions.length) setShowSuggestions(true) }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search menu..." className={inputClasses} />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a2e25] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  {suggestions.map(item => (
                    <button key={item.id} onMouseDown={() => selectSuggestion(item.name)}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#74a892]/10 text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer">
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="text-[#74a892] font-mono text-xs flex-shrink-0">৳{item.price || item.sizes?.[0]?.price || '-'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full bg-white/50 dark:bg-[#1a2e25]/50 flex items-center justify-center text-xl cursor-pointer hover:shadow-md transition-shadow">
              {darkMode ? '🌙' : '☀️'}
            </motion.button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white/50 dark:bg-[#1a2e25]/50 flex items-center justify-center cursor-pointer">
              {mobileMenuOpen ? <X size={20} className="text-gray-600 dark:text-gray-300" /> : <Menu size={20} className="text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden pb-4 space-y-4">
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true) }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search menu..." className="w-full px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#1a2e25]/80 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-[#74a892] text-sm" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a2e25] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    {suggestions.map(item => (
                      <button key={item.id} onMouseDown={() => selectSuggestion(item.name)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#74a892]/10 text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer">
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="text-[#74a892] font-mono text-xs flex-shrink-0">৳{item.price || item.sizes?.[0]?.price || '-'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest px-1 mb-3">Browse Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categoryLinks.map(link => (
                    <a key={link.label} href={link.href}
                      onClick={() => { link.action(); setMobileMenuOpen(false) }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all cursor-pointer border ${activeCategory === link.label.toLowerCase() ? 'bg-[#74a892]/15 border-[#74a892]/40 text-[#74a892] font-semibold' : 'bg-white/50 dark:bg-[#1a2e25]/50 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#74a892]/8 hover:border-[#74a892]/20'}`}>
                      <span className="text-xl">{link.icon}</span>
                      <span className="font-medium text-sm">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

function HeroSection({ data }) {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#74a892]/30 to-[#e8c88a]/20 blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#2d4a3e]/20 to-[#74a892]/20 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto hero-content">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1.5 }} className="mb-6">
          <span className="text-8xl md:text-9xl filter drop-shadow-2xl">🍹</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="font-heading text-4xl md:text-7xl lg:text-8xl font-bold mb-4">
          <span className="text-[#74a892]">Juicy</span>{' '}
          <span className="text-[#2d4a3e] dark:text-white">n</span>{' '}
          <span className="text-[#e8c88a]">Smoothie</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
          Fresh Taste. <span className="text-[#74a892]">Smooth</span> Experience.
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="text-base text-gray-500 dark:text-gray-400 mb-8">{data.restaurant.subtitle}</motion.p>
        <motion.button
          onClick={() => { const el = document.getElementById('menu'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#74a892] to-[#5c8a75] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-[#74a892]/30 transition-all cursor-pointer">
          <span>View Menu</span>
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-3 bg-[#74a892] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}

function CategoryTabs({ activeCategory, setActiveCategory, categories }) {
  return (
    <section className="py-6 px-4 sticky top-16 md:top-20 z-30 bg-[#FAFBF7]/95 dark:bg-[#0f231a]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="category-scroll">
          {categories.map((category) => (
            <motion.button key={category.id} onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`category-btn flex-shrink-0 ${activeCategory === category.id ? 'active' : ''}`}>
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

function MenuCard({ item, index }) {
  const [imgSrc, setImgSrc] = useState(item.image)
  const [imgFailed, setImgFailed] = useState(false)
  const hasSizes = item.sizes && item.sizes.length > 0
  const hasPrice = item.price !== undefined && item.price !== null

  const handleImgError = () => {
    if (!imgFailed) {
      setImgFailed(true)
      setImgSrc(`https://picsum.photos/seed/${item.name.replace(/[^a-zA-Z0-9]/g, '-')}/400/300`)
    } else {
      setImgSrc(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.04 }}
      className="menu-card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imgSrc ? (
          <img src={imgSrc} alt={item.name}
            onError={handleImgError}
            className="w-full h-full object-cover"
            loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[#74a892]/20 to-[#e8c88a]/20">🍽️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="font-heading text-base font-bold mb-2 text-gray-800 dark:text-white leading-tight">{item.name}</h3>
        {hasSizes ? (
          <div className="space-y-1.5">
            {item.sizes.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{s.size}</span>
                <span className="font-mono font-bold text-[#74a892]">৳{s.price}</span>
              </div>
            ))}
          </div>
        ) : hasPrice ? (
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-[#74a892]">৳{item.price}</span>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

function MenuSection({ activeCategory, searchQuery, menu, categories }) {
  const isFiltered = activeCategory !== 'all' || searchQuery

  const filteredItems = menu.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const grouped = {}
  if (!isFiltered) {
    categories.filter(c => c.id !== 'all').forEach(c => {
      const items = menu.filter(item => item.category === c.id)
      if (items.length > 0) grouped[c.id] = { category: c, items }
    })
  }

  return (
    <section id="menu" className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            <span className="text-[#2d4a3e] dark:text-white">Our</span>{' '}
            <span className="text-[#74a892]">Menu</span>
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No items found</p>
          </motion.div>
        ) : !isFiltered ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([catId, { category, items }]) => (
              <div key={catId}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#2d4a3e] dark:text-white">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-400">({items.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {items.map((item, index) => (
                    <MenuCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SpecialOffer({ offer }) {
  return (
    <section id="offer" className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-2 bg-white text-[#74a892] font-bold rounded-full text-sm mb-4">
            🔥 {offer.badge}
          </motion.span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">{offer.title}</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 text-center">
          <div className="text-6xl md:text-7xl mb-6">{offer.emoji}</div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">{offer.deal}</h3>
          <p className="text-white/80 text-lg mb-6">{offer.description}</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#74a892] font-bold rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <span>🔥</span>
            <span>{offer.buttonText}</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function AboutSection({ data }) {
  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" alt="Restaurant Interior"
                className="w-full rounded-3xl shadow-2xl object-cover h-72 md:h-96" />
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#74a892] to-[#e8c88a] text-white p-6 rounded-2xl shadow-lg">
                <p className="font-bold text-3xl">5+</p>
                <p className="text-sm">Years Active</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              <span className="text-[#2d4a3e] dark:text-white">About</span>{' '}
              <span className="text-[#74a892]">Us</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              {data.restaurant.name} brings fresh flavors, handcrafted drinks, premium burgers, pizzas, sandwiches, and coffee together in one modern dining experience.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Our commitment to quality ingredients and exceptional taste has made us a favorite destination for food lovers seeking a delightful culinary journey.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[{ number: `${data.menu.length}+`, label: 'Menu Items' }, { number: `${data.categories.length - 1}`, label: 'Categories' }, { number: '⭐⭐⭐⭐⭐', label: 'Rating' }].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} className="text-center">
                  <span className="text-2xl md:text-3xl font-bold text-[#74a892]">{stat.number}</span>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ContactSection({ data }) {
  const contactItems = [
    { icon: Phone, label: 'Phone', value: data.restaurant.phone, href: `tel:${data.restaurant.phone.replace(/[^0-9+]/g, '')}` },
    { icon: Instagram, label: 'Instagram', value: '@juicy_nsmoothie', href: 'https://instagram.com', isSocial: true },
    { icon: Facebook, label: 'Facebook', value: '@JuicyNSmoothie', href: 'https://facebook.com', isSocial: true },
    { icon: Clock, label: 'Hours', value: data.restaurant.hours, href: '#' },
  ]

  return (
    <section id="contact" className="py-16 px-4 bg-gray-100/50 dark:bg-[#0a1a14]/50">
      <div className="max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">
          <span className="text-[#2d4a3e] dark:text-white">Contact</span>{' '}
          <span className="text-[#74a892]">Us</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {contactItems.map((item, i) => (
            <motion.a key={i} href={item.href} target={item.isSocial ? '_blank' : undefined}
              rel={item.isSocial ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 text-center hover:bg-[#74a892]/10 transition-colors cursor-pointer">
              <item.icon className="w-8 h-8 mx-auto mb-3 text-[#74a892]" />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.value}</p>
            </motion.a>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 p-6 bg-gray-200/50 dark:bg-[#0a1a14]/50 rounded-2xl">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </div>
          <div className="h-48 w-full rounded-xl overflow-hidden shadow-inner">
            <iframe title="Juicy N Smoothie Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14600.755647941447!2d90.40346808715817!3d23.811880500000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c72417d4fd31%3A0x338ff98cff5b4568!2sJuicy%20N%20Smoothie!5e0!3m2!1sen!2sbd!4v1778789175762!5m2!1sen!2sbd"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer({ data, onAdminClick }) {
  const socialLinks = [
    { icon: Facebook, href: data.social?.facebook || '#' },
    { icon: Instagram, href: data.social?.instagram || '#' },
    { icon: Twitter, href: data.social?.twitter || '#' },
  ]

  return (
    <footer className="py-10 px-4 bg-gradient-to-r from-[#2d4a3e] to-[#1a2e25] text-white select-none">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center gap-4 mb-6">
          {socialLinks.map((link, i) => (
            <motion.a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-[#74a892] transition-colors cursor-pointer">
              <link.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
        <h3 className="font-heading text-2xl font-bold mb-2">🍹 {data.restaurant.name}</h3>
        <p className="text-white/80 mb-4">{data.restaurant.tagline}</p>
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <a href={data.developer.linkedin} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#e8c88a] transition-colors cursor-pointer">
            <Linkedin className="w-4 h-4" /> Developer
          </a>
          <a href={data.developer.instagram} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#e8c88a] transition-colors cursor-pointer">
            <Instagram className="w-4 h-4" /> Instagram
          </a>
        </div>
        <div className="border-t border-white/20 pt-6 mt-6">
          <p className="text-white/50 text-xs mb-1">
            🛡️ {data.sabrware?.tagline || 'Protected by SabrWare'}
          </p>
          <p className="text-white/60 text-sm mb-2">
            A <span className="text-[#e8c88a] font-semibold">{data.sabrware?.name || 'SabrWare'}</span> Product
          </p>
          <button onClick={onAdminClick}
            className="text-white/30 text-xs hover:text-white/60 transition-colors cursor-pointer">
            ⚙️ Admin Panel
          </button>
          <p className="text-white/20 text-xs mt-3 select-none">
            © 2024 {data.restaurant.name}. All rights reserved. Unauthorized copying prohibited.
          </p>
        </div>
      </div>
    </footer>
  )
}

function MobileBottomNav() {
  const navItems = [
    { href: '#', icon: '🏠', label: 'Home' },
    { href: '#menu', icon: '🍽️', label: 'Menu' },
    { href: '#offer', icon: '🔥', label: 'Offers' },
    { href: '#contact', icon: '📞', label: 'Contact' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="glass-nav border-t border-gray-200/20 dark:border-gray-700/20 safe-bottom">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}
              className="mobile-nav-item flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 cursor-pointer">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function AdminPanel({ data, onSave, onClose, tab, setTab, editItem, setEditItem }) {
  const [formData, setFormData] = useState(data)
  const [newItem, setNewItem] = useState({ name: '', category: 'pizza', price: '', image: '', sizes: [] })
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const handleAuth = () => {
    if (password === 'admin123') setAuthenticated(true)
    else alert('Incorrect password')
    setPassword('')
  }

  const handleSave = () => {
    onSave(formData)
    alert('Changes saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Reset all data to defaults?')) {
      resetData()
      window.location.reload()
    }
  }

  const addMenuItem = () => {
    if (!newItem.name) return alert('Item name is required')
    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      image: newItem.image || 'https://source.unsplash.com/800x600/?food',
      price: newItem.price ? parseInt(newItem.price) : undefined,
      sizes: newItem.sizes
    }
    setFormData(prev => ({ ...prev, menu: [...prev.menu, item] }))
    setNewItem({ name: '', category: 'pizza', price: '', image: '', sizes: [] })
  }

  const removeMenuItem = (id) => {
    if (confirm('Remove this item?'))
      setFormData(prev => ({ ...prev, menu: prev.menu.filter(i => i.id !== id) }))
  }

  const updateRestaurant = (field, value) => {
    setFormData(prev => ({ ...prev, restaurant: { ...prev.restaurant, [field]: value } }))
  }

  const updateOffer = (field, value) => {
    setFormData(prev => ({ ...prev, todayOffer: { ...prev.todayOffer, [field]: value } }))
  }

  const updateSocial = (field, value) => {
    setFormData(prev => ({ ...prev, social: { ...prev.social, [field]: value } }))
  }

  const [dataUrlInput, setDataUrlInput] = useState(getDataUrl() || '')

  const handleSetDataUrl = () => {
    setDataUrl(dataUrlInput)
    alert(dataUrlInput ? 'Data URL saved! Customers will now fetch data from this URL on next page load.' : 'Data URL removed. Customers will use the default built-in data.')
  }

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white dark:bg-[#1a2e25] rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
          <h2 className="font-heading text-2xl font-bold text-center mb-6 text-[#2d4a3e] dark:text-white">Admin Access</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && handleAuth()}
            className="w-full px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f231a] focus:outline-none focus:border-[#74a892] mb-4 text-center" />
          <div className="flex gap-3">
            <button onClick={handleAuth}
              className="flex-1 py-3 bg-[#74a892] text-white font-bold rounded-full hover:bg-[#5c8a75] transition-colors cursor-pointer">Login</button>
            <button onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-full hover:bg-gray-300 transition-colors cursor-pointer">Cancel</button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Default password: admin123</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0f231a] m-4 rounded-3xl shadow-2xl max-w-4xl mx-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white dark:bg-[#0f231a] rounded-t-3xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-heading text-xl font-bold text-[#2d4a3e] dark:text-white">⚙️ Admin Panel</h2>
            <div className="flex gap-2">
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#74a892] text-white rounded-full text-sm font-bold hover:bg-[#5c8a75] transition-colors cursor-pointer">
                <Save className="w-4 h-4" /> Save
              </button>
              <button onClick={onClose}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {[
              { id: 'menu', label: 'Menu' },
              { id: 'restaurant', label: 'Restaurant' },
              { id: 'offer', label: 'Offer' },
              { id: 'social', label: 'Social' },
              { id: 'publish', label: 'Publish' }
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${tab === t.id ? 'bg-[#74a892] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {tab === 'menu' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-lg text-[#2d4a3e] dark:text-white">Menu Items ({formData.menu.length})</h3>
                <span className="text-xs text-gray-400">Click ✕ to remove</span>
              </div>
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {formData.menu.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#1a2e25] rounded-xl p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.category}{item.sizes?.length ? ` (${item.sizes.length} sizes)` : item.price ? ` ৳${item.price}` : ''}</p>
                      </div>
                    </div>
                    <button onClick={() => removeMenuItem(item.id)}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500 cursor-pointer flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 dark:bg-[#1a2e25] rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3 text-[#2d4a3e] dark:text-white">Add New Item</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                    placeholder="Item name" className="col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f231a] text-sm focus:outline-none focus:border-[#74a892]" />
                  <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f231a] text-sm focus:outline-none focus:border-[#74a892]">
                    {data.categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                    placeholder="Price (৳)" type="number" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f231a] text-sm focus:outline-none focus:border-[#74a892]" />
                  <input value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))}
                    placeholder="Image URL" className="col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f231a] text-sm focus:outline-none focus:border-[#74a892]" />
                </div>
                <button onClick={addMenuItem}
                  className="mt-3 w-full py-3 bg-[#74a892] text-white font-bold rounded-xl hover:bg-[#5c8a75] transition-colors cursor-pointer">
                  + Add Item
                </button>
              </div>
            </div>
          )}

          {tab === 'restaurant' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#2d4a3e] dark:text-white">Restaurant Info</h3>
              {[
                { label: 'Name', field: 'name', value: formData.restaurant.name },
                { label: 'Tagline', field: 'tagline', value: formData.restaurant.tagline },
                { label: 'Subtitle', field: 'subtitle', value: formData.restaurant.subtitle },
                { label: 'Phone', field: 'phone', value: formData.restaurant.phone },
                { label: 'Hours', field: 'hours', value: formData.restaurant.hours },
                { label: 'Location', field: 'location', value: formData.restaurant.location },
              ].map(item => (
                <div key={item.field}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{item.label}</label>
                  <input value={item.value} onChange={e => updateRestaurant(item.field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e25] text-sm focus:outline-none focus:border-[#74a892]" />
                </div>
              ))}
            </div>
          )}

          {tab === 'offer' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#2d4a3e] dark:text-white">Today's Offer</h3>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Enable Offer</label>
                <button onClick={() => updateOffer('enabled', !formData.todayOffer.enabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${formData.todayOffer.enabled ? 'bg-[#74a892]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.todayOffer.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {[
                { label: 'Badge', field: 'badge', value: formData.todayOffer.badge },
                { label: 'Title', field: 'title', value: formData.todayOffer.title },
                { label: 'Emoji', field: 'emoji', value: formData.todayOffer.emoji },
                { label: 'Deal', field: 'deal', value: formData.todayOffer.deal },
                { label: 'Description', field: 'description', value: formData.todayOffer.description },
                { label: 'Button Text', field: 'buttonText', value: formData.todayOffer.buttonText },
              ].map(item => (
                <div key={item.field}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{item.label}</label>
                  <input value={item.value} onChange={e => updateOffer(item.field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e25] text-sm focus:outline-none focus:border-[#74a892]" />
                </div>
              ))}
            </div>
          )}

          {tab === 'social' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#2d4a3e] dark:text-white">Social Links</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Edit your restaurant's social media links. These appear in the footer.</p>
              {[
                { label: 'Facebook URL', field: 'facebook', value: formData.social?.facebook || '' },
                { label: 'Instagram URL', field: 'instagram', value: formData.social?.instagram || '' },
                { label: 'Twitter URL', field: 'twitter', value: formData.social?.twitter || '' },
              ].map(item => (
                <div key={item.field}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{item.label}</label>
                  <input value={item.value} onChange={e => updateSocial(item.field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e25] text-sm focus:outline-none focus:border-[#74a892]" />
                </div>
              ))}
            </div>
          )}

          {tab === 'publish' && (
            <div className="space-y-5">
              <h3 className="font-bold text-lg text-[#2d4a3e] dark:text-white">📤 Publish Changes</h3>

              <div className="bg-[#74a892]/10 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-[#2d4a3e] dark:text-white">Step 1: Download your data</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the button below to download all your menu, offers, and settings as a JSON file.
                </p>
                <button onClick={() => exportDataAsJson(formData)}
                  className="w-full py-3 bg-[#74a892] text-white font-bold rounded-xl hover:bg-[#5c8a75] transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Download Data as JSON
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-[#2d4a3e] dark:text-white">Step 2: Upload the file</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Upload the downloaded <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">menu-data.json</code> file to any free file hosting service:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Netlify Drop</strong> — Go to <span className="text-[#74a892] font-medium">drop.netlify.app</span>, drag & drop a folder with the JSON file</li>
                    <li><strong>GitHub</strong> — Upload to any repo, copy the raw URL</li>
                    <li><strong>JSONBin</strong> — Go to <span className="text-[#74a892] font-medium">jsonbin.io</span>, paste JSON, copy the share URL</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#e8c88a]/20 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-[#2d4a3e] dark:text-white">Step 3: Paste the URL here</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Paste the public URL of your uploaded JSON file. All customers will fetch data from this address.
                </p>
                <input value={dataUrlInput} onChange={e => setDataUrlInput(e.target.value)}
                  placeholder="https://example.com/menu-data.json"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e25] text-sm focus:outline-none focus:border-[#74a892]" />
                <button onClick={handleSetDataUrl}
                  className="w-full py-3 bg-[#2d4a3e] text-white font-bold rounded-xl hover:bg-[#1a2e25] transition-colors cursor-pointer">
                  {dataUrlInput ? 'Save Data URL' : 'Remove Data URL'}
                </button>
                {getDataUrl() && (
                  <p className="text-xs text-[#74a892] font-medium">
                    ✅ Current data URL: <span className="font-mono break-all">{getDataUrl()}</span>
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5">
                <h4 className="font-bold text-sm text-[#2d4a3e] dark:text-white mb-2">🔄 How it works</h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal pl-5 space-y-1">
                  <li>Edit your menu/offers/social in the tabs above</li>
                  <li>Come here and <strong>Download Data as JSON</strong></li>
                  <li>Upload the file to any free host (Netlify Drop, GitHub, etc.)</li>
                  <li>Paste the public URL above and click <strong>Save Data URL</strong></li>
                  <li>All customers will now see the updated data instantly — no rebuild needed!</li>
                  <li>For future updates: just edit, download, and re-upload the file to the same URL</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleReset}
              className="w-full py-3 bg-red-500/10 text-red-600 font-bold rounded-xl hover:bg-red-500/20 transition-colors cursor-pointer text-sm">
              Reset All Data to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
