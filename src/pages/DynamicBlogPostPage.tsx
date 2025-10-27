import { useParams } from 'react-router-dom';
import { Blogpost1 } from './BlogPost';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

// Mock data for demonstration
const mockPosts = {
  'pdf-to-word-tips': {
    title: '5 Tips for Better PDF to Word Conversions',
    authorName: 'Jane Doe',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg',
    pubDate: new Date('2024-10-26'),
    description: 'Unlock the full potential of your document conversions with these expert tips for flawless results every time.',
    authorImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp',
  },
  'secure-converter': {
    title: 'Why Our Converter is the Most Secure Choice',
    authorName: 'John Smith',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg',
    pubDate: new Date('2024-10-22'),
    description: 'Learn about the advanced security measures we take to protect your sensitive documents during conversion.',
    authorImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp',
  },
  'batch-processing': {
    title: 'Introducing Batch Processing for Pro Users',
    authorName: 'Admin',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg',
    pubDate: new Date('2024-10-15'),
    description: 'Save time and boost your productivity by converting multiple PDFs at once with our new batch processing feature.',
    authorImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp',
  },
  'jpg-vs-png': {
    title: 'A Guide to Choosing the Right Image Format (JPG vs. PNG)',
    authorName: 'Emily White',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg',
    pubDate: new Date('2024-10-10'),
    description: 'When converting PDFs to images, which format should you choose? We break down the pros and cons of JPG and PNG.',
    authorImage: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp',
  },
};

const DynamicBlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real application, you would use useQuery here to fetch the post data
  const post = slug ? mockPosts[slug as keyof typeof mockPosts] : undefined;

  if (!post) {
    return (
      <motion.main 
        className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Alert className="max-w-md">
          <Frown className="h-4 w-4" />
          <AlertTitle>Post Not Found</AlertTitle>
          <AlertDescription>
            The blog post with slug "{slug}" could not be found.
          </AlertDescription>
        </Alert>
      </motion.main>
    );
  }

  return <Blogpost1 post={post} />;
};

export default DynamicBlogPostPage;