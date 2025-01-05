export default function hello({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>
          {/* <h2 className="text-right text-lg">Hello</h2> */}
          {children}
        </body>
      </html>
    );
  }