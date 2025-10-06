import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from 'framer-motion';

const faqs = [
  { q: 'Is this PDF converter free to use?', a: 'Yes, our basic PDF converter is completely free for a limited number of conversions per day. For more advanced features and unlimited use, you can upgrade to our Pro plan.' },
  { q: 'Is my data secure?', a: 'Absolutely. We prioritize your privacy and security. All uploaded files are encrypted and automatically deleted from our servers after 24 hours.' },
  { q: 'What file formats can I convert to?', a: 'You can convert your PDFs to a variety of formats including DOCX, PPTX, JPG, TXT, and EPUB. We are always working to add more formats.' },
  { q: 'Is there a file size limit?', a: 'For free users, the maximum file size is 10MB. Pro users can upload files up to 1GB.' },
  { q: 'Do I need to install any software?', a: 'No, our PDF converter is a fully web-based tool. All you need is a modern web browser and an internet connection.' },
];

const FAQPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? We've got answers.
        </p>
      </motion.div>

      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </main>
  );
};

export default FAQPage;