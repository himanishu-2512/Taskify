// utils/cn.ts (or utils.js)
export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  