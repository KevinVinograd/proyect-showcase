/** Viewport matrix for visual QA — covers mobile, tablet, and desktop. */
export const VIEWPORTS = [
  { name: 'iPhone SE',  width: 375,  height: 812  },
  { name: 'iPhone 14',  width: 390,  height: 844  },
  { name: 'iPad',       width: 768,  height: 1024 },
  { name: 'Laptop',     width: 1280, height: 800  },
  { name: 'Desktop',    width: 1440, height: 900  },
];

export const MOBILE_VIEWPORTS = VIEWPORTS.filter(v => v.width < 768);
