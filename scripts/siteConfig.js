/* 目录：1. 叉子素材与角度 2. 各主题贴纸配色 3. 主题循环顺序 4. 导航面板占位内容 */
export const siteConfig = {
  cursor: {
    image: 'assets/icons/fork.png',
    restAngle: 10,
    hoverAngle: 32,
  },
  themes: [
    { id: 'tomato', name: 'Tomato red', background: '#A01B0C', sticker: 'assets/images/print-stickers/Group 632647-print.svg' },
    { id: 'cream', name: 'Cream', background: '#F5E0AE', sticker: 'assets/images/print-stickers/Group 632646-print.svg' },
    { id: 'olive', name: 'Olive', background: '#7C7E00', sticker: 'assets/images/print-stickers/Group 632645-print.svg' },
  ],
  panels: {
    tomato: { label: 'Which kind of tomato are you?', title: 'Still ripening.', body: 'A little tomato discovery is coming soon.' },
    about: { label: 'About', title: 'Hello, we’re Tomato Studio.', body: 'An independent design agency. More about the studio is coming soon.' },
    projects: { label: 'Projects', title: 'Fresh work, coming soon.', body: 'Our selected projects are getting ready for their debut.' },
    contact: { label: 'Contact', title: 'Let’s make something.', body: 'Our contact details will be available here soon.' },
  },
};
