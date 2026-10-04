import React from 'react';
import { Youtube, ExternalLink } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const CREATORS = [
  {
    id: 'yessmartypie',
    name: 'YesSmartyPie',
    subscribers: '6.89M',
    youtubeUrl: 'https://www.youtube.com/@yessmartypie',
    handle: '@yessmartypie',
    avatar: '/creators/yessmartypie.webp',
  },
  {
    id: 'senpaispider',
    name: 'SenpaiSpider',
    subscribers: '2.74M',
    youtubeUrl: 'https://www.youtube.com/@senpaispider',
    handle: '@senpaispider',
    avatar: '/creators/senpaispider.webp',
  },
  {
    id: 'yugplayz',
    name: 'Yug Playz',
    subscribers: '2.64M',
    youtubeUrl: 'https://www.youtube.com/@yugplayz',
    handle: '@yugplayz',
    avatar: '/creators/yugplayz.webp',
  },
  {
    id: 'senpaiextras',
    name: 'SenpaiExtras',
    subscribers: '2.38M',
    youtubeUrl: 'https://www.youtube.com/@senpaiextras',
    handle: '@senpaiextras',
    avatar: '/creators/senpaiextras.webp',
  },
  {
    id: 'imtiyano',
    name: 'IMTIYANO',
    subscribers: '1.92M',
    youtubeUrl: 'https://www.youtube.com/@imtiyano',
    handle: '@imtiyano',
    avatar: '/creators/imtiyano.webp',
  },
  {
    id: 'bulkystar',
    name: 'Bulky Star',
    subscribers: '1.42M',
    youtubeUrl: 'https://www.youtube.com/@bulkystar',
    handle: '@bulkystar',
    avatar: '/creators/bulkystar.webp',
  },
  {
    id: 'risibletwins',
    name: 'Risible Twins',
    subscribers: '1.17M',
    youtubeUrl: 'https://www.youtube.com/@risibletwins',
    handle: '@risibletwins',
    avatar: '/creators/risibletwins.webp',
  },
  {
    id: 'nizgamer',
    name: 'Niz Gamer',
    subscribers: '939K',
    youtubeUrl: 'https://www.youtube.com/@nizgamer',
    handle: '@nizgamer',
    avatar: '/creators/nizgamer.webp',
  },
  {
    id: 'pepper',
    name: 'Pepper',
    subscribers: '512K',
    youtubeUrl: 'https://youtube.com/@justapepper?si=3OVvuvt9Mjv5BRSs',
    handle: '@justapepper',
    avatar: '/creators/pepper_channel.webp',
  },
  {
    id: 'unsortedguy',
    name: 'unsorted guy',
    subscribers: '441K',
    youtubeUrl: 'https://www.youtube.com/@unsortedguy',
    handle: '@unsortedguy',
    avatar: '/creators/unsortedguy.webp',
  },
  {
    id: 'mrfenix47',
    name: 'Mr Fenix 47',
    subscribers: '405K',
    youtubeUrl: 'https://www.youtube.com/@mrfenix47',
    handle: '@mrfenix47',
    avatar: '/creators/mrfenix47.webp',
  },
  {
    id: 'protagnst',
    name: 'Protag nst',
    subscribers: '379K',
    youtubeUrl: 'https://www.youtube.com/@protagnst',
    handle: '@protagnst',
    avatar: '/creators/protagnst.webp',
  },
  {
    id: 'bulky',
    name: 'Bulky',
    subscribers: '324K',
    youtubeUrl: 'https://www.youtube.com/@bulky',
    handle: '@bulky',
    avatar: '/creators/bulky_channel.webp',
  },
  {
    id: 'notrexy',
    name: 'NotRexy',
    subscribers: '261K',
    youtubeUrl: 'https://www.youtube.com/@notrexy',
    handle: '@notrexy',
    avatar: '/creators/notrexy.webp',
  },
  {
    id: 'mitsuhagaming',
    name: 'Mitsuha Gaming',
    subscribers: '123K',
    youtubeUrl: 'https://youtube.com/@mitsuha_gaming?si=hhSJdXHPCIp-smn8',
    handle: '@mitsuha_gaming',
    avatar: '/creators/mitsuha_gaming.webp',
  },
  {
    id: 'aadmiplays',
    name: 'Aadmi Plays',
    subscribers: '73.5K',
    youtubeUrl: 'https://www.youtube.com/@aadmiiplays',
    handle: '@aadmiiplays',
    avatar: '/creators/aadmiplays_channel.webp',
  },
  {
    id: 'iskevin',
    name: 'IsKevin',
    subscribers: '68.6K',
    youtubeUrl: 'https://www.youtube.com/@iskevin',
    handle: '@iskevin',
    avatar: '/creators/iskevin.webp',
  },
  {
    id: 'livingextra',
    name: 'LivingExtra',
    subscribers: '34.9K',
    youtubeUrl: 'https://youtube.com/@livingextraop?si=FpXr3eGi0LfbW8eK',
    handle: '@livingextraop',
    avatar: '/creators/livingextra_op.webp',
  },
  {
    id: 'palmzy',
    name: 'Palmzy',
    subscribers: '27.4K',
    youtubeUrl: 'https://www.youtube.com/@palmzyyt',
    handle: '@palmzyyt',
    avatar: '/creators/palmzy.webp',
  },
  {
    id: 'definitelydeadyt',
    name: 'DefinitelyDead',
    subscribers: '22.8K',
    youtubeUrl: 'https://www.youtube.com/@definitelydeadyt',
    handle: '@definitelydeadyt',
    avatar: '/creators/definitelydead_tv.webp',
  },
  {
    id: 'camel27',
    name: 'Camel27',
    subscribers: '18.3K',
    youtubeUrl: 'https://www.youtube.com/channel/UCk4WYUDThO4RuSfFR-CmKfw',
    handle: '@Camel27_YT',
    avatar: '/creators/camel27_channel.webp',
  },
  {
    id: 'eltro',
    name: 'ElTro',
    subscribers: '10.4K',
    youtubeUrl: 'https://www.youtube.com/@elastromc',
    handle: '@elastromc',
    avatar: '/creators/eltro_mc.webp',
  },
  {
    id: 'milanzonderq',
    name: 'MilanZonderQ',
    subscribers: '1.09K',
    youtubeUrl: 'https://www.youtube.com/@milanzonderq',
    handle: '@milanzonderq',
    avatar: '/creators/milanzonderq.webp',
  },
  {
    id: 'definitelydead',
    name: 'DefinitelyDead',
    subscribers: '739',
    youtubeUrl: 'https://www.youtube.com/@definitelydead',
    handle: '@definitelydead',
    avatar: '/creators/definitelydead.webp',
  },
];

export default function Creators() {
  return (
    <section id="creators" className="section creators-section">
      <div className="section-title">
        <span className="section-num">03</span>
        <div>
          <h2 className="section-name">Creators Worked With</h2>
          <p className="section-subtitle">
            Trusted by YouTube creators and channels for high-CTR thumbnails and visual branding.
          </p>
        </div>
      </div>

      {/* Grid of 2-Layer Atmospheric Creator Cards */}
      <div className="creators-grid">
        {CREATORS.map((creator, i) => (
          <div className="atmospheric-creator-card" key={creator.id}>
            <Tape position={i % 2 === 0 ? 'tl' : 'tr'} />

            {/* Reconstructed Two-Layer Atmospheric Background System */}
            <div className="card-background" aria-hidden="true">
              <div className="upper-atmosphere" />
              <div className="transition-glow" />
              <div className="lower-atmosphere" />
            </div>

            {/* Creator Card Content */}
            <div className="creator-card-inner">
              {/* Channel Icon crossing the atmospheric transition line */}
              <div className="creator-avatar-wrap">
                <div className="creator-avatar-ring">
                  <img
                    src={creator.avatar}
                    alt={`${creator.name} channel icon`}
                    className="creator-avatar-img"
                    width="74"
                    height="74"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="creator-avatar-fallback">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Lower Surface Info */}
              <div className="creator-info-zone">
                <h3 className="creator-name">{creator.name}</h3>
                <span className="creator-handle">{creator.handle}</span>

                <div className="creator-subs-badge">
                  <Youtube size={13} className="subs-yt-icon" />
                  <span>{creator.subscribers} Subscribers</span>
                </div>

                <a
                  href={creator.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-channel-btn"
                  aria-label={`Visit ${creator.name} YouTube Channel (opens in a new tab)`}
                >
                  <span>Channel</span>
                  <ExternalLink size={12} className="btn-arrow" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Doodle kind="sparkle" size={24} style={{ top: 30, right: 30, color: 'var(--purple)' }} />
    </section>
  );
}
