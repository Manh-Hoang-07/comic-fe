function toOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export default function Head() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const apiOrigin = toOrigin(apiUrl);

  return (
    <>
      {apiOrigin ? (
        <>
          <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={apiOrigin} />
        </>
      ) : null}
      {/* Preconnect cho image CDN nếu dùng domain khác */}
      <link rel="preconnect" href="/_next/image" />
    </>
  );
}
