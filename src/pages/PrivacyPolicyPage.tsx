import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Privacy Policy</h1>
        <div className="text-muted-foreground space-y-6 text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-3xl font-bold text-foreground pt-4">1. Introduction</h2>
          <p>
            Welcome to PDF Converter. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the Application includes your uploaded files. We do not store your files permanently. All uploaded and converted files are automatically deleted from our servers after 24 hours.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">3. Use of Your Information</h2>
          <p>
            Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to temporarily process your files for conversion.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          
          <h2 className="text-3xl font-bold text-foreground pt-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us through our <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default PrivacyPolicyPage;