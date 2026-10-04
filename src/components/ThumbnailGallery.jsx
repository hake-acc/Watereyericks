import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';
import BeforeAfterSection from './ComparisonSlider.jsx';

// 49 Curated Production Thumbnails by Water Eye
const THUMBNAILS = [
  {
    id: 'we-01',
    title: '100 Days Cobblemon: Mega Garchomp',
    subtitle: 'Fiery aura & explosive evolution showcase',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-01-mega-garchomp.webp',
    featured: true,
  },
  {
    id: 'we-02',
    title: 'Giant Hunter: Hide and Seek',
    subtitle: 'Colossal armored hunter tracking hidden player',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-02-giant-hunter.webp',
  },
  {
    id: 'we-03',
    title: 'Skull Mountain Slayer',
    subtitle: 'Dual enchanted blades atop bone peaks',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-03-skull-mountain-slayer.webp',
  },
  {
    id: 'we-04',
    title: "The Wither King's Invasion",
    subtitle: 'Nether portals and floating Withers over castle siege',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-04-wither-king-invasion.webp',
  },
  {
    id: 'we-05',
    title: 'Deep Sea Abyssal Serpent',
    subtitle: 'Skeletal leviathan guarding sunken trident in abyss',
    category: '3D & Cinema 4D',
    subcat: '3D & Cinema 4D',
    tools: ['Cinema 4D', 'Photoshop'],
    img: '/samples/sample-05-deep-sea-abyssal-serpent.webp',
  },
  {
    id: 'we-06',
    title: 'Diamond Legion vs Wither Storm',
    subtitle: 'Colossal Wither Storm tractor beams facing royal army',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-06-diamond-legion-wither-storm.webp',
  },
  {
    id: 'we-07',
    title: 'Empire Clash: Two Kingdoms',
    subtitle: 'Golden warhammer warlord between Nether and Crystal legions',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-07-empire-clash-two-kingdoms.webp',
  },
  {
    id: 'we-08',
    title: '100 Days Cobblemon: Alpha Charizard',
    subtitle: 'Golden Alpha Charizard volcanic inferno',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-08-alpha-charizard.webp',
  },
  {
    id: 'we-09',
    title: 'Returning to My 10-Year-Old World',
    subtitle: 'Nostalgic boat voyage to classic base',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-09-bulky-old-home-world.webp',
  },
  {
    id: 'we-10',
    title: 'Netherite Castle Vanguard',
    subtitle: 'Enchanted three-warrior strike team outside grand fortress',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-10-netherite-castle-vanguard.webp',
  },
  {
    id: 'we-11',
    title: 'The Ancient Ice Cavern Stargate',
    subtitle: 'Lone explorer with lantern discovering glowing cyan gateway',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-11-ice-cavern-stargate.webp',
  },
  {
    id: 'we-13',
    title: '100 Days TNT Nuke Stronghold',
    subtitle: 'Massive atomic TNT mushroom cloud obliterating stone stronghold',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-13-fortress-tnt-nuke.webp',
  },
  {
    id: 'we-15',
    title: 'The Casket of Reveries: Awakened Titan',
    subtitle: 'Ancient rune colossus glowing with purple glyphs',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-15-casket-of-reveries-awakened.webp',
  },
  {
    id: 'we-16',
    title: '100 Days Cobblemon: Shiny Charizard',
    subtitle: 'Dark Shiny Charizard unleashing crimson flames over crags',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-16-shiny-charizard.webp',
  },
  {
    id: 'we-17',
    title: '100 Days Cobblemon: Summer Pikachu',
    subtitle: 'Pikachu in sunglasses & tropical shirt with iced drink',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-17-chilled-pikachu.webp',
  },
  {
    id: 'we-18',
    title: 'Orbital Strike TNT Cannon',
    subtitle: 'King targeting fortress with raining rings of TNT',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-18-orbital-strike-cannon.webp',
  },
  {
    id: 'we-19',
    title: '100 Days Cobblemon: Primal Groudon',
    subtitle: 'Molten Primal Groudon roaring over volcanic eruption',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-19-primal-groudon.webp',
  },
  {
    id: 'we-20',
    title: 'Minecraft Fantasy: Arcane Grand Wizard',
    subtitle: 'Purple-robed archmage wielding glowing grimoire & staff',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-20-arcane-grand-wizard.webp',
  },
  {
    id: 'we-21',
    title: '100 Days Fantasy: Runic Axe vs Lich King',
    subtitle: 'Hero flanked by winged fire demon and skeleton overlord',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-21-runic-axe-lich-demon.webp',
  },
  {
    id: 'we-22',
    title: '100 Days Hardcore: Crimson Fire Dragon',
    subtitle: 'Colossal red dragon breathing infernal fire over fortress',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-22-crimson-fire-dragon.webp',
  },
  {
    id: 'we-23',
    title: "The Enchanted Legion's March",
    subtitle: 'Purple warlord leading armored warriors from grand cathedral',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-23-enchanted-legion-march.webp',
  },
  {
    id: 'we-24',
    title: '100 Days Prominence: The Hasturian Era',
    subtitle: 'Yellow-robed eldritch king Hastur with cosmic floating eyes',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-24-prominence-hasturian-era.webp',
  },
  {
    id: 'we-25',
    title: 'Colossal Red-Eyed Mech Spider',
    subtitle: 'Giant mechanical terror towering over snowy forest',
    category: '3D & Cinema 4D',
    subcat: '3D & Cinema 4D',
    tools: ['Cinema 4D', 'Photoshop'],
    img: '/samples/sample-25-colossal-mech-spider.webp',
  },
  {
    id: 'we-26',
    title: 'The Underwater Trident King',
    subtitle: 'Dolphin rider leading diamond guard toward submerged temples',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-26-underwater-trident-king.webp',
  },
  {
    id: 'we-27',
    title: '100 Days Soulrem: Fire & Blood',
    subtitle: 'Flaming sword champion and horned knight under blood moon',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-27-soulrem-fire-and-blood.webp',
  },
  {
    id: 'we-28',
    title: 'Minecraft Feudal: Katana Samurai & Dragon',
    subtitle: 'Red warrior unsheathing katana with eastern dragon over pagodas',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-28-feudal-katana-samurai-dragon.webp',
  },
  {
    id: 'we-29',
    title: 'Minecraft Feudal: Bamboo Forest Samurai',
    subtitle: 'Cyan armored warrior walking through sunlit misty bamboo grove',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-29-bamboo-forest-samurai.webp',
  },
  {
    id: 'we-30',
    title: 'Radiant SMP: Midnight Minecart Squad',
    subtitle: 'Four players speeding on night rails led by enchanted king',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-30-radiant-smp-midnight-railway.webp',
  },
  {
    id: 'we-31',
    title: '100 Days Fantasy: Paladin vs Dark Knight',
    subtitle: 'Golden champion dueling dark knight before burning fortress',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-31-golden-paladin-vs-dark-knight.webp',
  },
  {
    id: 'we-32',
    title: '100 Days Prominence: Spellcasters at Twilight',
    subtitle: 'Purple mage duo with lightning staff and flaming sword on battlements',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-32-prominence-twilight-spellcasters.webp',
  },
  {
    id: 'we-33',
    title: '100 Days Superior: Lightning Warrior & Sorceress',
    subtitle: 'Storm blade champion and witch summoning celestial magic circle',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-33-superior-lightning-warrior-sorceress.webp',
  },
  {
    id: 'we-34',
    title: 'Radiant SMP: Daylight Minecart Expedition',
    subtitle: 'Sunlit alpine railway journey with full creator squad',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-34-radiant-smp-daylight-expedition.webp',
  },
  {
    id: 'we-35',
    title: 'Cobblemon: Mega Rayquaza & Meteor Shower',
    subtitle: 'Sky dragon descending amidst burning atmospheric fireballs',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-35-mega-rayquaza-meteors.webp',
  },
  {
    id: 'we-36',
    title: 'Fallen Rival in the Deep Woods',
    subtitle: 'Diamond king and warrior standing over defeated adversary',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-36-fallen-rival-deep-woods.webp',
  },
  {
    id: 'we-37',
    title: 'Radiant SMP Day 2: The Alliance Assembles',
    subtitle: 'Full server team gathering on vibrant grassy plains',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-37-radiant-smp-day2-alliance.webp',
  },
  {
    id: 'we-38',
    title: 'Samurai & Arcane Sorcerer Duo',
    subtitle: 'Cyan blade master and purple mage channeling golden magic rune',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-38-samurai-arcane-duo.webp',
  },
  {
    id: 'we-39',
    title: 'Winter Woods Showdown',
    subtitle: 'Snowy forest clash between cloaked hero and rage-empowered fighter',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-39-winter-woods-showdown.webp',
  },
  {
    id: 'we-40',
    title: '100 Days Cobblemon: Cavern Onix',
    subtitle: 'Giant stone serpent roaring from subterranean abyss',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-40-cavern-onix.webp',
  },
  {
    id: 'we-41',
    title: '100 Days Cobblemon: Shiny Greninja',
    subtitle: 'Submerged black ninja frog ready with dual water shurikens',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-41-shiny-greninja.webp',
  },
  {
    id: 'we-42',
    title: '100 Days Cobblemon: The Starter Trio',
    subtitle: 'Treecko, Fennekin, and Totodile leaping across sunny meadow',
    category: 'Minecraft',
    subcat: 'Cobblemon',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-42-cobblemon-starter-trio.webp',
  },
  {
    id: 'we-43',
    title: 'The Chained Celestial Blade',
    subtitle: 'King standing before immense runic celestial sword in cosmic void',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-43-chained-celestial-blade.webp',
  },
  {
    id: 'we-44',
    title: 'Double Chest of Enchanted Books',
    subtitle: 'Two explorers discovering massive glowing enchanted loot',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/sample-44-double-chest-enchanted-books.webp',
  },
  {
    id: 'we-45',
    title: 'The Diamond Vanguard vs Wither Storm',
    subtitle: 'King leading diamond army against colossal purple-beam boss',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-45-diamond-vanguard-vs-wither-storm.webp',
  },
  {
    id: 'we-46',
    title: 'Giant Mutant Zombie Titan',
    subtitle: 'Player facing hulking mutant zombie horde under clear blue sky',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-46-giant-mutant-zombie.webp',
  },
  {
    id: 'we-47',
    title: 'Mutant Zombie Horde: Apocalyptic Sky',
    subtitle: 'Mutant titan battle with moody twilight storm lighting',
    category: 'Minecraft',
    subcat: 'SMP & Adventure',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-47-mutant-zombie-apocalypse.webp',
  },
  {
    id: 'we-48',
    title: '100 Days RLCraft: Undead Skeleton King',
    subtitle: 'Golden skeleton lord dual-wielding broadswords on skull mountain',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-48-rlcraft-skeleton-king.webp',
  },
  {
    id: 'we-49',
    title: '100 Days Prominence: The Hasturian Triad',
    subtitle: 'Molten fire titan, flame champion & the King in Yellow',
    category: 'Minecraft',
    subcat: 'Boss Battles',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/sample-49-prominence-hasturian-triad.webp',
  },
];

const CATEGORIES = ['All', 'Minecraft', 'Cobblemon', 'Boss Battles', 'SMP & Adventure', '3D & Cinema 4D'];

export default function ThumbnailGallery() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const filtered = useMemo(() => {
    // Exclude featured thumbnail from the grid on 'All' view since it is already showcased above
    if (selectedCat === 'All') return THUMBNAILS.filter((t) => !t.featured);
    if (selectedCat === 'Minecraft') return THUMBNAILS.filter((t) => t.category === 'Minecraft');
    if (selectedCat === 'Cobblemon') return THUMBNAILS.filter((t) => t.subcat === 'Cobblemon');
    if (selectedCat === 'Boss Battles') return THUMBNAILS.filter((t) => t.subcat === 'Boss Battles');
    if (selectedCat === 'SMP & Adventure') return THUMBNAILS.filter((t) => t.subcat === 'SMP & Adventure');
    if (selectedCat === '3D & Cinema 4D') return THUMBNAILS.filter((t) => t.category === '3D & Cinema 4D' || t.subcat === '3D & Cinema 4D');
    return THUMBNAILS.filter((t) => t.category === selectedCat || t.subcat === selectedCat);
  }, [selectedCat]);

  const featured = useMemo(() => THUMBNAILS.find((t) => t.featured), []);

  const getCatCount = useCallback((cat) => {
    if (cat === 'All') return THUMBNAILS.length;
    if (cat === 'Minecraft') return THUMBNAILS.filter((t) => t.category === 'Minecraft').length;
    if (cat === 'Cobblemon') return THUMBNAILS.filter((t) => t.subcat === 'Cobblemon').length;
    if (cat === 'Boss Battles') return THUMBNAILS.filter((t) => t.subcat === 'Boss Battles').length;
    if (cat === 'SMP & Adventure') return THUMBNAILS.filter((t) => t.subcat === 'SMP & Adventure').length;
    if (cat === '3D & Cinema 4D') return THUMBNAILS.filter((t) => t.category === '3D & Cinema 4D' || t.subcat === '3D & Cinema 4D').length;
    return THUMBNAILS.filter((t) => t.category === cat || t.subcat === cat).length;
  }, []);

  const handleOpenModal = useCallback((thumb) => {
    setActiveModal(thumb);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Keyboard accessibility: Close modal on Escape key
  React.useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, handleCloseModal]);

  return (
    <section id="work" className="section work-section">
      <div className="section-title">
        <span className="section-num">02</span>
        <div>
          <h2 className="section-name">Selected Thumbnails</h2>
          <p className="section-subtitle">
            Every thumbnail is built from scratch in Photoshop, Cinema 4D, and Blender —
            engineered to stand out in YouTube home and suggested feeds.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-wrap" role="tablist" aria-label="Thumbnail categories">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
              <span className="cat-count">{getCatCount(cat)}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Large Showcase (Only shown on 'All') */}
      {selectedCat === 'All' && featured && (
        <div className="featured-showcase-wrap">
          <Tape position="tr" />
          <div className="featured-badge">
            <Sparkles size={14} /> FEATURED SHOWCASE
          </div>
          <div
            className="featured-showcase-card"
            onClick={() => handleOpenModal(featured)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(featured)}
            aria-label={`View full preview of ${featured.title}`}
          >
            <div className="featured-showcase-media">
              <img
                src={featured.img}
                alt={featured.title}
                loading="eager"
                className="featured-showcase-img"
              />
              <div className="showcase-hover-overlay">
                <span className="showcase-zoom-btn">
                  <Maximize2 size={16} /> Click to Inspect 4K Quality
                </span>
              </div>
            </div>
            <div className="featured-showcase-info">
              <div className="showcase-tags">
                <span className="chip-category">{featured.category}</span>
                {featured.tools.map((t) => (
                  <span className="chip-tool" key={t}>{t}</span>
                ))}
              </div>
              <h3 className="featured-showcase-title">{featured.title}</h3>
              <p className="featured-showcase-desc">{featured.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Thumbnail Grid */}
      <div className="thumbnail-grid">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
            className="thumb-card"
            onClick={() => handleOpenModal(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(item)}
            aria-label={`Inspect ${item.title}`}
          >
            <Tape position={idx % 2 === 0 ? 'tl' : 'tr'} />
            
            <div className="thumb-media-wrap">
              <img
                src={item.img}
                alt={`${item.title} — YouTube Thumbnail by Water Eye`}
                loading="lazy"
                className="thumb-img"
              />
              <div className="thumb-overlay">
                <span className="thumb-zoom-icon">
                  <Maximize2 size={16} />
                </span>
              </div>
            </div>

            <div className="thumb-details">
              <div className="thumb-meta-row">
                <span className="thumb-category-tag">{item.subcat || item.category}</span>
                <div className="thumb-tools">
                  {item.tools.map((t) => (
                    <span key={t} className="thumb-tool-tag">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="thumb-card-title">{item.title}</h3>
              <p className="thumb-card-sub">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Before & After Thumbnail Comparison Subsection */}
      <BeforeAfterSection />

      {/* Lightbox Inspection Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-panel"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-cat">{activeModal.subcat || activeModal.category}</span>
                  <h3 className="modal-title">{activeModal.title}</h3>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close preview modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-image-wrap">
                <img
                  src={activeModal.img}
                  alt={activeModal.title}
                  className="modal-full-img"
                />
              </div>

              <div className="modal-footer">
                <div className="modal-tools">
                  <span className="modal-label">Software:</span>
                  {activeModal.tools.map((t) => (
                    <span key={t} className="tech-chip">{t}</span>
                  ))}
                </div>
                <div className="modal-sub">{activeModal.subtitle}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Doodle kind="sparkle" size={28} style={{ top: 25, right: 30, color: 'var(--purple)' }} />
    </section>
  );
}
