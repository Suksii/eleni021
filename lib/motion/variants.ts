export const slideSpring = {
  type: "spring",
  stiffness: 380,
  damping: 36,
} as const;

export const slideVariants = {
  initial: (dir: 1 | -1) => ({ x: `${dir * 100}%` }),
  animate: { x: "0%" },
  exit: (dir: 1 | -1) => ({ x: `${dir * -100}%` }),
};

export const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

export const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

export const gridItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};
