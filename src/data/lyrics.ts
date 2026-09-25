export interface LyricLine {
  id: string;
  start: number;
  end: number;
  text: string;
  koreanNotes?: string;
  isHighlight?: boolean;
}

export interface SongSection {
  id: string;
  title: string;
  shortLabel: string;
  start: number;
  end: number;
  type: 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'dance-break' | 'bridge' | 'outro';
  lines: LyricLine[];
}

export const SONG_DURATION = 182; // 3:02 total seconds

export const SONG_SECTIONS: SongSection[] = [
  {
    id: 'intro',
    title: 'Intro',
    shortLabel: 'Intro',
    start: 0,
    end: 11.8,
    type: 'intro',
    lines: [
      {
        id: 'intro-1',
        start: 0,
        end: 2.0,
        text: '♪ [Opening Beat Drop] ♪',
      },
      {
        id: 'intro-2',
        start: 2.0,
        end: 4.8,
        text: "Blackpink in your area! Nah, it's Ira!",
        isHighlight: true,
      },
      {
        id: 'intro-3',
        start: 4.8,
        end: 8.0,
        text: 'Uri queen is here, and she is unstoppable!',
        koreanNotes: 'Uri = Our',
      },
      {
        id: 'intro-4',
        start: 8.0,
        end: 11.8,
        text: "Ten years of fire, you ready to ignite? Let's go!",
        isHighlight: true,
      },
    ],
  },
  {
    id: 'verse-1',
    title: 'Verse 1',
    shortLabel: 'Verse 1',
    start: 11.8,
    end: 27.8,
    type: 'verse',
    lines: [
      {
        id: 'v1-1',
        start: 11.8,
        end: 15.6,
        text: 'Step aside, make way for the birthday girl, yeah!',
      },
      {
        id: 'v1-2',
        start: 15.6,
        end: 17.8,
        text: 'Ira is shining bright, she is rocking the world!',
        isHighlight: true,
      },
      {
        id: 'v1-3',
        start: 17.8,
        end: 20.0,
        text: 'Double digits now, yeah, she is standing so tall!',
      },
      {
        id: 'v1-4',
        start: 20.0,
        end: 23.0,
        text: 'Modu jiptung! She is the best of them all!',
        koreanNotes: 'Modu jiptung = Everyone pay attention!',
      },
      {
        id: 'v1-5',
        start: 23.0,
        end: 25.5,
        text: 'Confidence on max, yeah, she owns the whole room!',
      },
      {
        id: 'v1-6',
        start: 25.5,
        end: 27.8,
        text: 'With a smile that can make all the spring flowers bloom!',
      },
    ],
  },
  {
    id: 'pre-chorus-1',
    title: 'Pre-Chorus',
    shortLabel: 'Pre-Chorus',
    start: 27.8,
    end: 45.8,
    type: 'pre-chorus',
    lines: [
      {
        id: 'pc1-1',
        start: 27.8,
        end: 32.0,
        text: 'Dugun-dugun, feel the bass in your chest!',
        koreanNotes: 'Dugun-dugun = Heart thumping with excitement',
      },
      {
        id: 'pc1-2',
        start: 32.0,
        end: 37.8,
        text: 'Shrestha is coming, yeah, she is the absolute best!',
        isHighlight: true,
      },
      {
        id: 'pc1-3',
        start: 37.8,
        end: 42.5,
        text: 'Turn up the volume, let the whole world hear the name!',
      },
      {
        id: 'pc1-4',
        start: 42.5,
        end: 45.8,
        text: 'Ira is the queen, yeah, she is winning the game!',
        isHighlight: true,
      },
    ],
  },
  {
    id: 'chorus-1',
    title: 'Chorus',
    shortLabel: 'Chorus 1',
    start: 45.8,
    end: 76.0,
    type: 'chorus',
    lines: [
      {
        id: 'c1-1',
        start: 45.8,
        end: 49.5,
        text: "Ira! Ira! Gaja, let's go!",
        koreanNotes: "Gaja = Let's go!",
        isHighlight: true,
      },
      {
        id: 'c1-2',
        start: 49.5,
        end: 53.2,
        text: 'Ira! Ira! Put on a show!',
        isHighlight: true,
      },
      {
        id: 'c1-3',
        start: 53.2,
        end: 57.5,
        text: 'Ten years old, shining so bright!',
      },
      {
        id: 'c1-4',
        start: 57.5,
        end: 62.5,
        text: 'We are going to make it iconic tonight!',
        isHighlight: true,
      },
      {
        id: 'c1-5',
        start: 62.5,
        end: 69.5,
        text: 'Saeng-il chukha-hae, our beautiful queen!',
        koreanNotes: 'Saeng-il chukha-hae = Happy Birthday!',
      },
      {
        id: 'c1-6',
        start: 69.5,
        end: 76.0,
        text: "The most amazing girl that this world's ever seen!",
        isHighlight: true,
      },
    ],
  },
  {
    id: 'dance-break',
    title: 'Dance Break',
    shortLabel: 'Dance Break',
    start: 76.0,
    end: 107.5,
    type: 'dance-break',
    lines: [
      {
        id: 'db-1',
        start: 76.0,
        end: 84.0,
        text: '✨ [Dance Break] Feel the rhythm & drop the bass! ✨',
      },
      {
        id: 'db-2',
        start: 84.0,
        end: 96.0,
        text: '👑 Center stage for Birthday Superstar Ira! 👑',
      },
      {
        id: 'db-3',
        start: 96.0,
        end: 107.5,
        text: '✨ Ten years of grace, energy, and royal style! ✨',
      },
    ],
  },
  {
    id: 'verse-2',
    title: 'Verse 2',
    shortLabel: 'Verse 2',
    start: 107.5,
    end: 126.0,
    type: 'verse',
    lines: [
      {
        id: 'v2-1',
        start: 107.5,
        end: 110.0,
        text: 'Shrestha is in the house, yeah, she is making them stare!',
      },
      {
        id: 'v2-2',
        start: 110.0,
        end: 112.8,
        text: 'With her style and her grace, no one else can compare!',
        isHighlight: true,
      },
      {
        id: 'v2-3',
        start: 112.8,
        end: 115.5,
        text: 'Daebak! Wonderful! Yeah, that is her vibe!',
        koreanNotes: 'Daebak = Amazing / Incredible!',
      },
      {
        id: 'v2-4',
        start: 115.5,
        end: 118.2,
        text: 'The coolest ten-year-old in the whole entire tribe!',
      },
      {
        id: 'v2-5',
        start: 118.2,
        end: 123.5,
        text: 'I-I-I-Ira? No! It is I-I-I-Ira! Get it right!',
        isHighlight: true,
      },
      {
        id: 'v2-6',
        start: 123.5,
        end: 126.0,
        text: 'A shining superstar that is burning through the night!',
      },
    ],
  },
  {
    id: 'chorus-2',
    title: 'Chorus 2',
    shortLabel: 'Chorus 2',
    start: 126.0,
    end: 155.5,
    type: 'chorus',
    lines: [
      {
        id: 'c2-1',
        start: 126.0,
        end: 129.5,
        text: "Ira! Ira! Gaja, let's go!",
        koreanNotes: "Gaja = Let's go!",
        isHighlight: true,
      },
      {
        id: 'c2-2',
        start: 129.5,
        end: 132.2,
        text: 'Ira! Ira! Put on a show!',
        isHighlight: true,
      },
      {
        id: 'c2-3',
        start: 132.2,
        end: 136.0,
        text: 'Ten years old, shining so bright!',
      },
      {
        id: 'c2-4',
        start: 136.0,
        end: 141.5,
        text: 'We are going to make it iconic tonight!',
        isHighlight: true,
      },
      {
        id: 'c2-5',
        start: 141.5,
        end: 148.5,
        text: 'Saeng-il chukha-hae, our beautiful queen!',
        koreanNotes: 'Saeng-il chukha-hae = Happy Birthday!',
      },
      {
        id: 'c2-6',
        start: 148.5,
        end: 155.5,
        text: "The most amazing girl that this world's ever seen!",
        isHighlight: true,
      },
    ],
  },
  {
    id: 'bridge',
    title: 'Bridge',
    shortLabel: 'Bridge',
    start: 155.5,
    end: 171.5,
    type: 'bridge',
    lines: [
      {
        id: 'b-1',
        start: 155.5,
        end: 159.5,
        text: 'We are so proud of who you are, yeah, you make us so proud!',
        isHighlight: true,
      },
      {
        id: 'b-2',
        start: 159.5,
        end: 163.5,
        text: 'That is why we are all out here and singing so loud!',
      },
      {
        id: 'b-3',
        start: 163.5,
        end: 167.8,
        text: 'To the moon and beyond, yeah, your future is bright!',
        isHighlight: true,
      },
      {
        id: 'b-4',
        start: 167.8,
        end: 171.5,
        text: 'Ira, our star, you are ready to ignite!',
        isHighlight: true,
      },
    ],
  },
  {
    id: 'outro',
    title: 'Outro',
    shortLabel: 'Outro',
    start: 171.5,
    end: 182.0,
    type: 'outro',
    lines: [
      {
        id: 'o-1',
        start: 171.5,
        end: 173.5,
        text: 'Ira! Shrestha! We love you so!',
        isHighlight: true,
      },
      {
        id: 'o-2',
        start: 173.5,
        end: 175.5,
        text: 'Keep on shining and watch your power grow!',
      },
      {
        id: 'o-3',
        start: 175.5,
        end: 176.8,
        text: 'Ten years of awesome, the queen is on the throne!',
        isHighlight: true,
      },
      {
        id: 'o-4',
        start: 176.8,
        end: 181.5,
        text: "Ira is a superstar, yeah, the best we've ever known!",
        isHighlight: true,
      },
    ],
  },
];

export function getActiveLine(currentTime: number): { line: LyricLine; section: SongSection } | null {
  for (const section of SONG_SECTIONS) {
    if (currentTime >= section.start && currentTime <= section.end) {
      for (const line of section.lines) {
        if (currentTime >= line.start && currentTime <= line.end) {
          return { line, section };
        }
      }
      // If within section but between lines, return first upcoming or last passed
      return { line: section.lines[0], section };
    }
  }
  return null;
}
