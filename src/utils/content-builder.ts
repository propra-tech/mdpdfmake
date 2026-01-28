export function addToContent<T>(content: T[], item: T, push: boolean = true): T {
  if (push) content.push(item);
  return item;
}
