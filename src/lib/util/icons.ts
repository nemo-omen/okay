import * as Icons from '@lucide/svelte/icons';

export function getIcon(name: string) {
  const icon = Icons[name as keyof typeof Icons];
  if (!icon) {
    throw new Error(`Icon "${name}" not found in lucide icons.`);
  }
  return icon;
}

export function getIconNames() {
  const fullSet = Object.keys(Icons).filter((key) => {
    return key && key !== 'defaultAttributes' && key !== 'icons';
  });

  const filteredSet = fullSet.filter((key) => {
    if (!key.startsWith('Lucide') && !key.endsWith('Icon')) {
      return true;
    }
    return false;
  });

  return filteredSet;
}

export function getIcons() {
  return Icons;
}