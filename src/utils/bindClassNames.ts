export default function bindClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
