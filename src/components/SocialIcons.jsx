import React, { useState } from 'react';
import { Mail, Check, Copy } from 'lucide-react';

export function DiscordIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function XIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function BehanceIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.469 0-5.5-2.679-5.5-6.188 0-3.438 2.125-6.094 5.375-6.094 3.781 0 5.141 3.094 4.75 6.438h-7.797c.078 1.938 1.484 3.078 3.328 3.078 1.344 0 2.266-.625 2.656-1.578l2.159 1.344zm-7.641-4.703h5.297c-.062-1.641-.938-2.547-2.5-2.547-1.578 0-2.609.922-2.797 2.547zm-10.703 4.703h-5.382v-14h5.75c3.219 0 4.75 1.547 4.75 4 0 1.281-.625 2.531-1.781 3.125 1.5.547 2.375 1.922 2.375 3.594 0 2.453-1.688 3.281-5.712 3.281zm-2.882-8.562h2.5c1.438 0 2.219-.594 2.219-1.75 0-1.047-.734-1.688-2.078-1.688h-2.641v3.438zm0 6.562h2.766c1.609 0 2.469-.719 2.469-1.984 0-1.344-.922-2.016-2.578-2.016h-2.657v4z" />
    </svg>
  );
}

export function YTJobsIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <polygon points="10 11 15 14 10 17" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const SOCIALS = [
  {
    id: 'discord',
    name: 'Discord',
    username: 'watereyetheog',
    url: 'https://discord.com/users/watereyetheog',
    type: 'discord',
    title: 'Discord: watereyetheog (Primary Contact)',
    icon: DiscordIcon,
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    username: '@ItzWatereye',
    url: 'https://x.com/ItzWatereye',
    type: 'link',
    title: 'X: @ItzWatereye',
    icon: XIcon,
  },
  {
    id: 'behance',
    name: 'Behance',
    username: 'Thumblabs',
    url: 'https://www.behance.net/Thumblabs',
    type: 'link',
    title: 'Behance: Thumblabs',
    icon: BehanceIcon,
  },
  {
    id: 'ytjobs',
    name: 'YT Jobs',
    username: 'Water Eye',
    url: 'https://ytjobs.co/talent/profile/597018',
    type: 'link',
    title: 'YT Jobs Profile: 597018',
    icon: YTJobsIcon,
  },
  {
    id: 'email',
    name: 'Email',
    username: 'hakebusinesswork@gmail.com',
    url: 'mailto:hakebusinesswork@gmail.com',
    type: 'link',
    title: 'Email: hakebusinesswork@gmail.com',
    icon: Mail,
  },
];

export function SocialButtonsRow({ size = 16, className = '' }) {
  const [copied, setCopied] = useState(false);

  const copyDiscord = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText('watereyetheog');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = 'watereyetheog';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`social-buttons-row ${className}`}>
      {SOCIALS.map((s) => {
        const IconComponent = s.icon;
        if (s.id === 'discord') {
          return (
            <button
              key={s.id}
              type="button"
              onClick={copyDiscord}
              className={`social-icon social-icon--discord ${copied ? 'is-copied' : ''}`}
              aria-label={copied ? 'Copied watereyetheog to clipboard!' : s.title}
              title={copied ? 'Copied watereyetheog!' : s.title}
            >
              {copied ? <Check size={size} /> : <IconComponent size={size} />}
            </button>
          );
        }

        return (
          <a
            key={s.id}
            href={s.url}
            target={s.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={s.url.startsWith('mailto:') ? undefined : 'noreferrer'}
            className={`social-icon social-icon--${s.id}`}
            aria-label={s.title}
            title={s.title}
          >
            <IconComponent size={size} />
          </a>
        );
      })}
    </div>
  );
}
