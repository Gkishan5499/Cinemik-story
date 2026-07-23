export type StoryBlock =
  | { type: 'text'; content: string }
  | { type: 'quote'; content: string; speaker: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; src: string; caption?: string }
  | { type: 'divider'; label: string };

export interface EpisodeData {
  id: number;
  ep: string;
  arc: string;
  title: string;
  desc: string;
  video: string;
  story: StoryBlock[];
  runtime: string;
  aired: string;
  nextId?: number;
}

export const EPISODES_DATA: Record<number, EpisodeData> = {
  1: {
    id: 1, ep: 'EP. 01', arc: 'ACT I — THE FALLEN KINGDOM', title: 'THE FIRST BLADE',
    video: '/fire.mp4',
    runtime: '22 min', aired: 'Winter 2022',
    desc: 'A young wanderer discovers a blade from the age of gods.',
    nextId: 5,
    story: [
      { type: 'text', content: 'Before the world had names for its own wounds, there was a blade.' },
      { type: 'video', src: '/fire.mp4', caption: 'The Ashen Plains — birthplace of the First Blade' },
      { type: 'text', content: 'Kairu found it half-buried in the roots of a dead god tree.' },
      { type: 'text', content: 'It did not glow. It did not hum. It simply waited.' },
      { type: 'image', src: '/character_1.png', alt: 'Kairu', caption: 'Kairu — seventeen years old, already tired of waiting' },
      { type: 'quote', content: 'Take it. Every destiny begins with a mistake.', speaker: 'The Old Keeper of the Ashen Plains' },
      { type: 'text', content: 'He wrapped it in cloth and walked east — not knowing east had already chosen him.' },
      { type: 'divider', label: 'The Sky Turns Crimson' },
      { type: 'text', content: 'The sky above the village turned a deep, impossible crimson.' },
      { type: 'image', src: '/world_map.png', alt: 'The Kingdom', caption: 'The last known map of the unified kingdom' },
      { type: 'text', content: 'No one in the village spoke of it. Some things are too large to name.' },
    ]
  },
  5: {
    id: 5, ep: 'EP. 05', arc: 'ACT I — THE FALLEN KINGDOM', title: 'ASHES OF THE CAPITAL',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Winter 2022',
    desc: 'The great capital falls in a single night of fire.',
    nextId: 12,
    story: [
      { type: 'text', content: 'They said Ashfall had never once seen a fire it could not tame.' },
      { type: 'text', content: 'They were wrong.' },
      { type: 'video', src: '/fire.mp4', caption: 'Ashfall burns — the night of the Great Collapse' },
      { type: 'text', content: 'The fire that came that night was not born from spark or torch.' },
      { type: 'quote', content: 'It came from the sky — a breath from something older than the city\'s oldest stone.', speaker: 'The Last Chronicle of Ashfall' },
      { type: 'image', src: '/character_1.png', alt: 'Kairu on the hill', caption: 'Kairu watching the capital fall from the eastern ridge' },
      { type: 'text', content: 'Kairu watched from the hill as a hundred thousand lives became embers.' },
      { type: 'divider', label: 'A Name Unlearned' },
      { type: 'quote', content: 'Run.', speaker: 'A woman beside him. Her name was Yori. He had not yet learned it.' },
      { type: 'text', content: 'He did not run. He stood until the last tower fell, burned it into his memory.' },
      { type: 'text', content: 'A city that is forgotten is a city that truly dies. He would not let it die.' },
    ]
  },
  12: {
    id: 12, ep: 'EP. 12', arc: 'ACT I — THE FALLEN KINGDOM', title: 'BLOOD COVENANT',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Spring 2022',
    desc: 'A forbidden pact is sealed beneath the crimson moon.',
    nextId: 20,
    story: [
      { type: 'text', content: 'The crimson moon only rises when the old laws are about to break.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4', caption: 'The spirit realm stirs beneath the crimson moon' },
      { type: 'text', content: 'Three warlords met in the ruins of a temple that had no name left.' },
      { type: 'image', src: '/world_map.png', alt: 'The fractured territories', caption: 'The three warlords\' territories after the Collapse' },
      { type: 'text', content: 'Kairu was not invited. He came anyway.' },
      { type: 'quote', content: 'You cannot stop what has already been agreed.', speaker: 'Lord Vael, eldest of the warlords' },
      { type: 'divider', label: 'The Altar' },
      { type: 'text', content: 'Kairu placed the First Blade on the altar between them.' },
      { type: 'quote', content: 'Then I will make them agree to something else.', speaker: 'Kairu' },
      { type: 'text', content: 'The moon watched. Three seals were broken. One impossible covenant was born.' },
    ]
  },
  20: {
    id: 20, ep: 'EP. 20', arc: 'ACT II — THE CRIMSON TIDE', title: 'THE HOLLOW FOREST',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Fall 2022',
    desc: 'Ancient spirits awaken as the armies cross the sacred border.',
    nextId: 27,
    story: [
      { type: 'text', content: 'The Hollow Forest had been silent for three centuries.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4', caption: 'The Hollow Forest — a place where the old gods still breathe' },
      { type: 'text', content: 'No army had ever been foolish enough to march through its heart.' },
      { type: 'text', content: 'Until now.' },
      { type: 'divider', label: 'The Trees Remember' },
      { type: 'text', content: 'The trees here remembered the old war — the one before language.' },
      { type: 'image', src: '/character_1.png', alt: 'Yori leading the march', caption: 'Yori, Empress of Ash, leading the vanguard into the forest' },
      { type: 'quote', content: 'Fall back.', speaker: 'Yori. No one moved fast enough.' },
      { type: 'text', content: 'The forest took eleven soldiers before the spirits decided to speak.' },
      { type: 'quote', content: 'You do not belong here.', speaker: 'The Spirits of the Hollow Forest, in a voice like roots splitting stone' },
      { type: 'quote', content: 'Neither do the ones we are chasing.', speaker: 'Kairu' },
      { type: 'text', content: 'A long silence. Then — the trees parted.' },
    ]
  },
  27: {
    id: 27, ep: 'EP. 27', arc: 'ACT II — THE CRIMSON TIDE', title: 'EMPRESS OF ASH',
    video: '/fire.mp4',
    runtime: '26 min', aired: 'Winter 2022',
    desc: 'Yori reclaims the shattered throne — at a terrible cost.',
    nextId: 34,
    story: [
      { type: 'text', content: 'The throne room of Ashfall had been rebuilt in bone and silence.' },
      { type: 'image', src: '/world_map.png', alt: 'The rebuilt capital', caption: 'Ashfall rebuilt — stone over stone over grave' },
      { type: 'text', content: 'Yori walked its length alone, armored, unhurried.' },
      { type: 'text', content: 'The warlords who sat in her father\'s seats rose one by one.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4', caption: 'The night of the Reclamation' },
      { type: 'quote', content: 'You cannot rule what is already broken.', speaker: 'The man at the center seat' },
      { type: 'quote', content: 'Then I will rule the breaking.', speaker: 'Yori, Empress of Ash' },
      { type: 'divider', label: 'Forty-Seven Seconds' },
      { type: 'text', content: 'She took the throne in forty-seven seconds.' },
      { type: 'image', src: '/character_1.png', alt: 'Yori on the throne', caption: 'The Empress of Ash — ruler of what remains' },
      { type: 'text', content: 'History would argue about the cost for the next two hundred years.' },
      { type: 'text', content: 'She did not argue. She governed.' },
    ]
  },
  34: {
    id: 34, ep: 'EP. 34', arc: 'ACT III — RECKONING OF ASH', title: 'THE FALLEN GODS',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Spring 2024',
    desc: 'A forgotten alliance is forged in the ruins.',
    nextId: 35,
    story: [
      { type: 'text', content: 'The smoking ruins of the Veilgate still smoldered at dawn.' },
      { type: 'video', src: '/fire.mp4', caption: 'The Veilgate — last stronghold of the God-Generals' },
      { type: 'text', content: 'Ayame stepped through the broken arch, sword trailing ash.' },
      { type: 'image', src: '/character_1.png', alt: 'Ayame', caption: 'Ayame — Blade of the Lotus, last of her order' },
      { type: 'text', content: 'Before her stood the last of the God-Generals — robed in crumbling obsidian.' },
      { type: 'quote', content: 'You came alone.', speaker: 'The God-General. It was not a question.' },
      { type: 'text', content: 'She placed her blade against the earth. An offering, not a surrender.' },
      { type: 'quote', content: 'No god falls alone. And neither will you.', speaker: 'Ayame' },
      { type: 'divider', label: 'The Pact of Ashes' },
      { type: 'text', content: 'The alliance was forged not in fire, but in the silence that followed.' },
      { type: 'text', content: 'History would call it the Pact of Ashes — signed in blood neither party wanted to shed.' },
    ]
  },
  35: {
    id: 35, ep: 'EP. 35', arc: 'ACT III — RECKONING OF ASH', title: 'CRIMSON TIDE',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Spring 2024',
    desc: 'The armies march on the Ash Citadel.',
    nextId: 36,
    story: [
      { type: 'text', content: 'Ninety thousand boots fell on cracked earth at the same moment.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4', caption: 'The march on the Ash Citadel — the largest army since the God Wars' },
      { type: 'text', content: 'The Ash Citadel had stood for eight hundred years.' },
      { type: 'text', content: 'It would not stand for eight hundred more.' },
      { type: 'image', src: '/character_1.png', alt: 'Ryoken leading the vanguard', caption: 'Ryoken — the First Blade burning cold in his grip' },
      { type: 'text', content: 'Ryoken led the vanguard, the First Blade burning with a cold crimson light.' },
      { type: 'quote', content: 'For the Lotus. For the Kingdom. For the dead.', speaker: 'The chant of ninety thousand soldiers' },
      { type: 'divider', label: 'The Gates Break' },
      { type: 'text', content: 'The gates were sealed — but gates are made to be broken.' },
      { type: 'text', content: 'The tide swept inward. Nothing in its path remained standing.' },
    ]
  },
  36: {
    id: 36, ep: 'EP. 36', arc: 'ACT III — RECKONING OF ASH', title: 'REQUIEM OF BLADES',
    video: '/fire.mp4',
    runtime: '26 min', aired: 'Spring 2024',
    desc: 'The season finale. Nothing will remain.',
    nextId: 37,
    story: [
      { type: 'text', content: 'There is a silence that only comes at the end of a war.' },
      { type: 'text', content: 'Not peaceful. Not safe. Just empty.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4', caption: 'The sky above the fallen Ash Citadel' },
      { type: 'image', src: '/character_1.png', alt: 'Ayame over the broken throne', caption: 'Ayame — victorious, wounded, uncertain' },
      { type: 'text', content: 'Ayame stood over the broken throne, her wound seeping through her robe.' },
      { type: 'text', content: 'Ryoken had not spoken since the final clash — his sword shattered, his pride with it.' },
      { type: 'quote', content: 'Is this what you wanted?', speaker: 'Ryoken' },
      { type: 'image', src: '/world_map.png', alt: 'The ruined kingdom', caption: 'What remained of the kingdom after the siege' },
      { type: 'quote', content: 'I wanted none of this. And yet — here we are.', speaker: 'Ayame' },
      { type: 'divider', label: 'Something New Breathes' },
      { type: 'text', content: 'The blade fell. The age ended.' },
      { type: 'text', content: 'And from the silence, something new began to breathe.' },
    ]
  },
  37: {
    id: 37, ep: 'EP. 37', arc: 'ACT IV — NEW DAWN', title: 'ECHOES OF TOMORROW',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Summer 2024',
    desc: 'A new dawn rises, but the shadows remain.',
    nextId: 38,
    story: [
      { type: 'text', content: 'Three months after the fall of the Citadel, the world tried to remember how to live.' },
      { type: 'image', src: '/world_map.png', alt: 'The recovering world', caption: 'Markets opened in half-burned towns' },
      { type: 'text', content: 'Children played among ruins. Markets opened in scorched squares.' },
      { type: 'text', content: 'But Ayame could not sleep.' },
      { type: 'video', src: '/fire.mp4', caption: 'The fires of memory — they never truly die' },
      { type: 'quote', content: 'The pact cuts both ways. You have not seen the end.', speaker: 'The God-General\'s voice, in her dreams' },
      { type: 'divider', label: 'Dawn Is Not Safe' },
      { type: 'text', content: 'She woke at dawn, sword already in her hand.' },
      { type: 'text', content: 'Tomorrow was not yet safe. It never was.' },
    ]
  },
  38: {
    id: 38, ep: 'EP. 38', arc: 'ACT IV — NEW DAWN', title: 'THE HOLLOW CROWN',
    video: '/fire.mp4',
    runtime: '24 min', aired: 'Summer 2024',
    desc: 'Betrayal from within the remaining leaders.',
    nextId: 39,
    story: [
      { type: 'text', content: 'The council of survivors met under a fractured moon.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-magical-glowing-particles-in-the-forest-34444-large.mp4', caption: 'The council chamber — seven banners, one traitor' },
      { type: 'text', content: 'Seven banners — six loyal, one hiding its true color.' },
      { type: 'image', src: '/character_1.png', alt: 'Keiro at the council', caption: 'Keiro — minister of grain, architect of betrayal' },
      { type: 'text', content: 'Keiro, once a minister of grain, had always smiled too easily.' },
      { type: 'quote', content: 'You fought to end the old order. But I am building the next one.', speaker: 'Keiro, dropping a stolen seal onto the table' },
      { type: 'divider', label: 'The Trap' },
      { type: 'text', content: 'Chairs scraped. Torches sputtered. Hands moved toward weapons.' },
      { type: 'text', content: 'Ayame\'s hand did not move to her sword.' },
      { type: 'text', content: 'She smiled. She had known for weeks. The trap was already sprung.' },
    ]
  },
  39: {
    id: 39, ep: 'EP. 39', arc: 'ACT IV — NEW DAWN', title: 'ASH AND BONE',
    video: '/fire.mp4',
    runtime: '28 min', aired: 'Summer 2024',
    desc: 'The final confrontation at the edge of the world.',
    story: [
      { type: 'text', content: 'At the edge of the known world, there is a cliff called the World\'s Last Breath.' },
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-starry-sky-30514-large.mp4', caption: 'The World\'s Last Breath — where the sky meets nothing' },
      { type: 'text', content: 'No one who had gone there for war had ever returned with clean hands.' },
      { type: 'image', src: '/character_1.png', alt: 'Ayame at the cliff edge', caption: 'Ayame — arriving at sunset, the wind pulling at her cloak like memory' },
      { type: 'text', content: 'Ayame reached it at sunset, wind pulling at her cloak like memory.' },
      { type: 'text', content: 'Keiro stood with his back to the drop, his stolen army nowhere in sight.' },
      { type: 'quote', content: 'Alone again.', speaker: 'Ayame' },
      { type: 'quote', content: 'We were always alone.', speaker: 'Keiro' },
      { type: 'divider', label: 'Four Minutes' },
      { type: 'text', content: 'The fight lasted four minutes. It felt like an entire life.' },
      { type: 'image', src: '/world_map.png', alt: 'The world at peace', caption: 'What the world looked like — after' },
      { type: 'text', content: 'He fell inward, not outward — swallowed by the world he tried to rule.' },
      { type: 'text', content: 'She stood at the edge until the stars came out. Then she walked home.' },
    ]
  },
};
