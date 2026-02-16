import "./global.css";

export const metadata = {
  title: "Finance Tracker"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
