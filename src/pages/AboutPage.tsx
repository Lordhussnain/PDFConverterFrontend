import { motion } from 'framer-motion';
import { Users, Zap, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Our Mission</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          To provide a simple, fast, and secure way for everyone to manage and convert their documents, breaking down barriers between file formats and empowering seamless digital workflows.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="p-6 rounded-lg">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Our powerful servers convert your files in seconds, so you can get back to what matters.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="p-6 rounded-lg">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">We respect your privacy. Your files are encrypted and automatically deleted after 24 hours.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="p-6 rounded-lg">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">For Everyone</h3>
            <p className="text-muted-foreground">Designed for students, professionals, and anyone in between. No software installation needed.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AboutPage;