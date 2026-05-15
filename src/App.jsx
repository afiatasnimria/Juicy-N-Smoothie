import { useState, useEffect, useRef, Suspense } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Text3D,
  Environment,
  ContactShadows,
  useTexture,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Sun,
  Moon,
  Plus,
  MapPin,
  Clock,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Menu Data
const menuData = [
  {
    id: 1,
    name: "Mint Lemonade",
    description: "Refreshing mint leaves with fresh lemon juice",
    price: 120,
    category: "lemonade",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80",
  },
  {
    id: 2,
    name: "Strawberry Lemonade",
    description: "Sweet strawberries blended with tangy lemonade",
    price: 150,
    category: "lemonade",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
  {
    id: 3,
    name: "Blue Lagoon Lemonade",
    description: "Exotic blue curacao with fresh lemonade",
    price: 180,
    category: "lemonade",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  },
  {
    id: 4,
    name: "Cheese Pizza",
    description: "Loaded with melted mozzarella and parmesan",
    price: 450,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80",
  },
  {
    id: 5,
    name: "Chicken BBQ Pizza",
    description: "Grilled chicken, BBQ sauce, red onions",
    price: 650,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  },
  {
    id: 6,
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with extra cheese",
    price: 700,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  },
  {
    id: 7,
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, special sauce",
    price: 280,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  },
  {
    id: 8,
    name: "Crispy Chicken Burger",
    description: "Crispy fried chicken with coleslaw, spicy mayo",
    price: 320,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80",
  },
  {
    id: 9,
    name: "Double Smash Burger",
    description: "Two smashed beef patties with double cheese",
    price: 450,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50d5?w=400&q=80",
  },
  {
    id: 10,
    name: "Club Sandwich",
    description: "Triple-decker with turkey, bacon, eggs",
    price: 220,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  },
  {
    id: 11,
    name: "Chicken Sandwich",
    description: "Grilled chicken with avocado, honey mustard",
    price: 250,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&q=80",
  },
  {
    id: 12,
    name: "Cheese Sandwich",
    description: "Toasted bread with melted cheese",
    price: 200,
    category: "sandwich",
    image:
      "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80",
  },
  {
    id: 13,
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: 180,
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
  },
  {
    id: 14,
    name: "Latte",
    description: "Smooth espresso with creamy steamed milk",
    price: 220,
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80",
  },
  {
    id: 15,
    name: "Cold Coffee",
    description: "Chilled espresso with milk and ice",
    price: 250,
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  },
  {
    id: 16,
    name: "Sweet Curd",
    description: "Fresh homemade creamy curd",
    price: 120,
    category: "curd",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  },
  {
    id: 17,
    name: "Mango Curd",
    description: "Rich mango pulp mixed with creamy curd",
    price: 160,
    category: "curd",
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
  },
  {
    id: 18,
    name: "Chocolate Curd",
    description: "Decadent chocolate mixed with smooth curd",
    price: 180,
    category: "curd",
    image:
      "https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?w=400&q=80",
  },
];

const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "lemonade", name: "Lemonade", icon: "🍋" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "sandwich", name: "Sandwich", icon: "🥪" },
  { id: "coffee", name: "Coffee", icon: "☕" },
  { id: "curd", name: "Curd", icon: "🥛" },
];

// 3D Components
function FloatingElement({ position, rotation, children }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} rotation={rotation}>
        {children}
      </mesh>
    </Float>
  );
}

function LemonadeGlass() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[0.8, 0.6, 2, 32]} />
      <meshPhysicalMaterial
        color="#FFE066"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0}
        transmission={0.5}
      />
    </FloatingElement>
  );
}

function Burger3D() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.5, 32]} />
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </FloatingElement>
  );
}

function Pizza3D() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshStandardMaterial color="#FFD93D" roughness={0.6} />
    </FloatingElement>
  );
}

function Scene({ mousePosition }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mousePosition.x * 0.5,
        0.1,
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mousePosition.y * 0.5,
        0.1,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B35" />

      <group ref={meshRef}>
        <LemonadeGlass />
      </group>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

// Particle Background
function ParticleBackground() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const emojis = ["🍋", "🍊", "🍓", "🥑", "☕", "🍔", "🍕"];
  const emojiSize = dimensions.width < 375 ? "text-lg" : "text-xl";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className={`absolute ${emojiSize} opacity-10 sm:opacity-20`}
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            y: [null, Math.random() * -80],
            x: [null, Math.random() * 40 - 20],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-6"
      >
        🍹
      </motion.div>
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-500 font-medium"
      >
        Loading deliciousness...
      </motion.p>
    </motion.div>
  );
}

// Navbar Component
function Navbar({ darkMode, setDarkMode, activeCategory, setActiveCategory }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="text-3xl md:text-4xl">🍹</span>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Juicy n Smoothie
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Digital Menu
              </p>
            </div>
          </motion.div>

          {/* Desktop Search - Removed */}

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/50 dark:bg-dark/50 flex items-center justify-center text-lg sm:text-xl cursor-pointer shadow-sm"
            >
              {darkMode ? "🌙" : "☀️"}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/50 dark:bg-dark/50 flex items-center justify-center cursor-pointer shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4"
            >
              <div className="flex flex-col gap-3 px-2">
                {/* Categories in mobile menu */}
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <motion.button
                      type="button"
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setMobileMenuOpen(false);
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`category-btn justify-center ${activeCategory === category.id ? "active" : ""}`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-semibold">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Gradient Orbs - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-secondary/20 to-primary/20 blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="mb-4 sm:mb-6"
        >
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl filter drop-shadow-2xl">
            🍹
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-tight"
        >
          <span className="text-primary">Juicy</span>{" "}
          <span className="text-secondary dark:text-white">n</span>{" "}
          <span className="text-accent">Smoothie</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 font-medium px-2"
        >
          Fresh Taste. <span className="text-primary">Futuristic</span>{" "}
          Experience.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8"
        >
          Scan. Explore. Enjoy. 🍽️
        </motion.p>

        <motion.button
          type="button"
          onClick={() => {
            const menuSection = document.getElementById("menu");
            if (menuSection) {
              menuSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer text-sm sm:text-base"
        >
          <span>View Menu</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Scroll Indicator - hide on very small screens */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

// Category Tabs - Horizontal scroll on all devices
function CategoryTabs({ activeCategory, setActiveCategory }) {
  const scrollRef = useRef(null);

  return (
    <section className="py-4 sm:py-6 px-4 sticky top-16 md:top-20 z-30 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3 sm:mb-4"
        >
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold">
            <span className="text-secondary dark:text-white">Our</span>{" "}
            <span className="text-primary">Categories</span>
          </h2>
        </motion.div>

        <div
          ref={scrollRef}
          className="category-scroll hide-scrollbar px-1 pb-1"
        >
          {categories.map((category) => (
            <motion.button
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
            >
              <span className="text-lg sm:text-xl">{category.icon}</span>
              <span className="text-sm sm:text-base">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Menu Card
function MenuCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -12 }}
      className="menu-card group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="font-heading text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-gray-800 dark:text-white line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base md:text-lg font-semibold text-primary dark:text-accent">
            ৳{item.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Menu Section
function MenuSection({ activeCategory }) {
  const filteredItems = menuData.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesCategory;
  });

  return (
    <section id="menu" className="py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold">
            <span className="text-secondary dark:text-white">Our</span>{" "}
            <span className="text-primary">Menu</span>
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {filteredItems.length} items
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No items found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Special Offer Section
function SpecialOffer() {
  return (
    <section id="offer" className="py-12 sm:py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-primary font-bold rounded-full text-xs sm:text-sm mb-3 sm:mb-4"
          >
            🔥 Today's Special
          </motion.span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-white">
            Special Offer
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center"
        >
          <div className="text-4xl sm:text-5xl md:text-7xl mb-4 sm:mb-6">🍕+🍋</div>
          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Buy 1 Pizza Get 1 Lemonade Free!
          </h3>
          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
            Valid for all pizza varieties. Refreshing lemonade included!
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const menuSection = document.getElementById("menu");
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
          >
            <span>🔥</span>
            <span>Limited Time Offer</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
                alt="Restaurant Interior"
                className="w-full rounded-2xl sm:rounded-3xl shadow-2xl object-cover h-64 sm:h-80 md:h-96"
              />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-gradient-to-r from-primary to-accent text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
              >
                <p className="font-bold text-2xl sm:text-3xl">5+</p>
                <p className="text-xs sm:text-sm">Years Active</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              <span className="text-secondary dark:text-white">About</span>{" "}
              <span className="text-primary">Us</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Juicy n Smoothie brings fresh flavors, handcrafted drinks, premium
              burgers, pizzas, sandwiches, and coffee together in one modern
              dining experience.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
              Our commitment to quality ingredients and exceptional taste has
              made us a favorite destination for food lovers seeking a
              delightful culinary journey.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { number: "18+", label: "Menu Items" },
                { number: "6", label: "Categories" },
                { number: "⭐⭐⭐⭐⭐", label: "Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <span className="text-lg sm:text-2xl md:text-3xl font-bold text-primary">
                    {stat.number}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 234 567 890",
      href: "tel:+1234567890",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "@JuicyNSmoothie",
      href: "https://facebook.com",
      isSocial: true,
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@juicy_nsmoothie",
      href: "https://instagram.com",
      isSocial: true,
    },
    { icon: Clock, label: "Hours", value: "10AM - 10PM", href: "#" },
  ];

  return (
    <section
      id="contact"
      className="py-12 sm:py-20 px-4 bg-gray-100/50 dark:bg-gray-900/50"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
        >
          <span className="text-secondary dark:text-white">Contact</span>{" "}
          <span className="text-primary">Us</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {contactItems.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.isSocial ? "_blank" : undefined}
              rel={item.isSocial ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-primary/10 transition-colors"
            >
              <item.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary" />
              <p className="font-semibold text-xs sm:text-sm">{item.label}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.value}
              </p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-3 sm:mb-4 text-sm">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Location</span>
          </div>
          <div className="h-40 sm:h-48 w-full rounded-lg sm:rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14600.755647941447!2d90.40346808715817!3d23.811880500000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c72417d4fd31%3A0x338ff98cff5b4568!2sJuicy%20N%20Smoothie!5e0!3m2!1sen!2sbd!4v1778789175762!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-10 sm:py-12 px-4 bg-gradient-to-r from-secondary to-secondary-dark text-white">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
        </div>

        <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">
          🍹 Juicy n Smoothie
        </h3>
        <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4">Fresh Taste, Smooth Experience</p>

        <div className="border-t border-white/20 pt-4 sm:pt-6 mt-4 sm:mt-6">
          <p className="text-white/60 text-xs sm:text-sm mb-2">
            Designed with ❤️ for Juicy n Smoothie
          </p>
          <p className="text-white/40 text-[10px] sm:text-xs">
            A product of <span className="text-accent">SabrWare</span>
          </p>
          <p className="text-white/30 text-[10px] sm:text-xs mt-2 sm:mt-3">
            © 2024 Juicy n Smoothie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Mobile Bottom Nav with active state tracking
function MobileBottomNav({ activeSection }) {
  const navItems = [
    { id: "hero", icon: "🏠", label: "Home" },
    { id: "menu", icon: "🍽️", label: "Menu" },
    { id: "offer", icon: "🔥", label: "Offers" },
    { id: "contact", icon: "📞", label: "Contact" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass-nav border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex justify-around py-1 safe-bottom">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              className={`mobile-nav-item flex flex-col items-center py-2 px-3 sm:px-4 cursor-pointer ${activeSection === item.id ? "active" : "text-gray-600 dark:text-gray-400"}`}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
              <span className="text-[10px] sm:text-xs mt-0.5">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Main App
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    // Mouse position tracking
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Track active section for mobile bottom nav
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFEF9] dark:bg-[#0D1117] transition-colors duration-300">
      <ParticleBackground />
      <LoadingScreen />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main>
        <HeroSection />
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <MenuSection activeCategory={activeCategory} />
        <SpecialOffer />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
      <MobileBottomNav activeSection={activeSection} />

      <div className="h-16 sm:h-20 lg:hidden" />
    </div>
  );
}

export default App;
