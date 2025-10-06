import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Terms of Service</h1>
        <div className="text-muted-foreground space-y-6 text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-3xl font-bold text-foreground pt-4">1. Agreement to Terms</h2>
          <p>
            By using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">2. Use of the Service</h2>
          <p>
            You agree to use the service only for lawful purposes. You are responsible for any content you upload and convert. You must not use the service to process any material that is illegal, defamatory, or infringing on intellectual property rights.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">3. Intellectual Property</h2>
          <p>
            We do not claim any ownership rights to the files you upload. You retain all your rights to any content you submit through the service.
          </p>

          <h2 className="text-3xl font-bold text-foreground pt-4">4. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is." We make no warranty that the service will meet your requirements or be available on an uninterrupted, secure, or error-free basis.
          </p>
          
          <h2 className="text-3xl font-bold text-foreground pt-4">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us through our <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default TermsOfServicePage;