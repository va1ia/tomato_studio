/* 目录：1. mechanical 音效来源 2. click / tap / info 原始合成参数 */
// Raphael Salaja, Mechanical v1.0.0 (MIT).
// https://audio.raphaelsalaja.com/library/mechanical
// https://github.com/raphaelsalaja/audio/blob/main/.web-kits/mechanical.json
// 许可：scripts/vendor/web-kits-audio/LICENSE。
export const mechanicalSounds = {
  name: 'Mechanical — Tomato Studio clicks',
  author: 'Raphael Salaja',
  version: '1.0.0',
  sounds: {
    click: {
      source: { type: 'noise', color: 'white' },
      filter: { type: 'bandpass', frequency: 3000, resonance: 4 },
      envelope: { attack: 0, decay: .02, sustain: 0, release: .006 },
      gain: .14,
    },
    tap: {
      source: { type: 'noise', color: 'white' },
      filter: { type: 'bandpass', frequency: 4000, resonance: 3 },
      envelope: { attack: 0, decay: .015, sustain: 0, release: .005 },
      gain: .12,
    },
    info: {
      source: { type: 'noise', color: 'white' },
      filter: { type: 'bandpass', frequency: 3000, resonance: 3.5 },
      envelope: { attack: 0, decay: .05, sustain: 0, release: .015 },
      gain: .1,
    },
  },
};
