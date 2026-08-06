import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "MCLAREN P1 GTR // THE CINEMATIC EXPERIENCE",
  description: "An Awwwards-quality interactive product showcase and cinematic experience featuring the legendary McLaren P1 GTR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
