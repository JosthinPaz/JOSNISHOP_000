export async function getImageDataUrl(path: string): Promise<string> {
  const res = await fetch(path);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error reading image'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
