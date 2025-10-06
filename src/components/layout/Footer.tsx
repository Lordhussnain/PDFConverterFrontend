const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PDF Converter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;