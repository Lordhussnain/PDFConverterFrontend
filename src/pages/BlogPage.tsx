import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: '5 Tips for Better PDF to Word Conversions',
    excerpt: 'Unlock the full potential of your document conversions with these expert tips for flawless results every time.',
    author: 'Jane Doe',
    date: 'October 26, 2024',
    slug: 'pdf-to-word-tips',
  },
  {
    title: 'Why Our Converter is the Most Secure Choice',
    excerpt: 'Learn about the advanced security measures we take to protect your sensitive documents during conversion.',
    author: 'John Smith',
    date: 'October 22, 2024',
    slug: 'secure-converter',
  },
  {
    title: 'Introducing Batch Processing for Pro Users',
    excerpt: 'Save time and boost your productivity by converting multiple PDFs at once with our new batch processing feature.',
    author: 'Admin',
    date: 'October 15, 2024',
    slug: 'batch-processing',
  },
  {
    title: 'A Guide to Choosing the Right Image Format (JPG vs. PNG)',
    excerpt: 'When converting PDFs to images, which format should you choose? We break down the pros and cons of JPG and PNG.',
    author: 'Emily White',
    date: 'October 10, 2024',
    slug: 'jpg-vs-png',
  },
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

const BlogPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">From Our Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tips, tutorials, and updates from the PDF Converter team.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogPosts.map((post) => (
          <motion.div key={post.slug} variants={itemVariants}>
            <Card className="h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <span>{post.author} · {post.date}</span>
                </div>
                <Link to={`/blogpost/${post.slug}`} className="flex items-center text-primary font-semibold hover:underline">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default BlogPage;