import "./globals.css";

export const metadata = {
  title: "AuroraShip",
  description: "US shipping label system"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
