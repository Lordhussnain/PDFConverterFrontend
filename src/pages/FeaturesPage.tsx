import { FileType, Image, FileText, Presentation, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  { icon: FileType, title: 'PDF to DOCX', description: 'Convert your PDFs to editable Word documents with preserved formatting.' },
  { icon: Presentation, title: 'PDF to PPTX', description: 'Turn your PDFs into engaging PowerPoint presentations.' },
  { icon: Image, title: 'PDF to JPG', description: 'Extract pages from your PDF as high-quality JPG images.' },
  { icon: FileText, title: 'PDF to TXT', description: 'Pull out the raw text from your PDF files for easy editing.' },
  { icon: BookOpen, title: 'PDF to EPUB', description: 'Transform your PDFs into a readable e-book format.' },
  { icon: FileType, title: 'More to Come', description: 'We are constantly working on adding new conversion formats.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const FeaturesPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Powerful Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to work with your PDF files in one place.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default FeaturesPage;