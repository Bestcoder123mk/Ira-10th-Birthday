import React, { useState } from 'react';
import { Send, Heart, Sparkles, MessageCircle, PartyPopper } from 'lucide-react';
import { triggerConfettiBurst } from './SparkleCanvas';

interface Wish {
  id: string;
  sender: string;
  relation: string;
  message: string;
  accent: 'pink' | 'gold' | 'rose';
  time: string;
}

const INITIAL_WISHES: Wish[] = [
  {
    id: 'w1',
    sender: 'Anirudh (Big Brother)',
    relation: 'Proud Brother',
    message: 'Happy 10th Birthday to my favorite little sister! You inspire me with your energy, your humor, and your fierce confidence every single day. Double digits suits you, Queen Ira!',
    accent: 'gold',
    time: 'Birthday Morning',
  },
  {
    id: 'w2',
    sender: 'Mom & Dad',
    relation: 'Loving Parents',
    message: 'To our darling Shrestha: watching you grow into this radiant, joyful 10-year-old girl is the greatest adventure of our lives. May your year be filled with laughter and big dreams!',
    accent: 'pink',
    time: 'Always with Love',
  },
  {
    id: 'w3',
    sender: 'The Whole Family Tribe',
    relation: 'All Relatives & Friends',
    message: 'Happy 10th Birthday, Ira! The coolest 10-year-old in the universe. Keep shining bright and rocking the world!',
    accent: 'rose',
    time: 'Celebration Day',
  },
];

export const BirthdayWishes: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [senderName, setSenderName] = useState('');
  const [relationText, setRelationText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      sender: senderName.trim(),
      relation: relationText.trim() || 'Family & Friend',
      message: messageText.trim(),
      accent: wishes.length % 2 === 0 ? 'pink' : 'gold',
      time: 'Just now',
    };

    setWishes([newWish, ...wishes]);
    setSenderName('');
    setRelationText('');
    setMessageText('');
    setSubmitted(true);
    triggerConfettiBurst();

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="wishes" className="relative py-16 lg:py-24 bg-[#08080c] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff2d78] mb-2">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Loving Messages</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Family Wishes</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Birthday Wishes Wall for Ira
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 font-['Plus_Jakarta_Sans'] max-w-xl mx-auto">
            Heartfelt blessings and birthday cheer for Shrestha turning 10. Add your own sweet note for the queen!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Wishes Feed */}
          <div className="lg:col-span-7 space-y-4">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0e0e16]/85 p-6 backdrop-blur-md shadow-md transition-all hover:border-white/[0.15]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="font-['Syne'] text-base font-bold text-white flex items-center gap-2">
                      <span>{w.sender}</span>
                      <span className="text-xs font-normal text-neutral-400">({w.relation})</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#ffd15c]/80">{w.time}</span>
                </div>
                <p className="mt-3 text-sm text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed">
                  "{w.message}"
                </p>
                <div className="mt-3 flex items-center justify-end text-xs text-neutral-500 gap-1">
                  <Heart className="h-3 w-3 fill-[#ff2d78] text-[#ff2d78]" />
                  <span>Blessing for Ira</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add a Wish Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-[#ffd15c]/25 bg-gradient-to-b from-[#14121a] to-[#0c0c12] p-6 sm:p-7 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffd15c] uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Leave a Birthday Blessing</span>
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                Wish Ira a Happy 10th Birthday!
              </h3>
              <p className="text-xs text-neutral-400 mb-5 font-['Plus_Jakarta_Sans']">
                Write a sweet message, fun memory, or celebratory prayer for Shrestha to read.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sender" className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Name
                  </label>
                  <input
                    id="sender"
                    type="text"
                    required
                    placeholder="e.g. Grandma, Cousin Neil, Best Friend"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#ffd15c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="relation" className="block text-xs font-medium text-neutral-300 mb-1">
                    Relationship
                  </label>
                  <input
                    id="relation"
                    type="text"
                    placeholder="e.g. Big Brother, Aunt, School Friend"
                    value={relationText}
                    onChange={(e) => setRelationText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#ffd15c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-neutral-300 mb-1">
                    Birthday Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Happy 10th Birthday Queen Ira! Wishing you lots of joy, fun dancing, and delicious cake..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#ffd15c] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2d78] to-[#ffd15c] px-4 py-3 text-xs font-bold text-neutral-950 shadow-md transition-all hover:opacity-95 active:scale-98"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Wish & Shower Confetti!</span>
                </button>

                {submitted && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-300 flex items-center justify-center gap-2">
                    <PartyPopper className="h-4 w-4 text-[#ffd15c]" />
                    <span>Your sweet birthday wish for Ira has been posted!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
