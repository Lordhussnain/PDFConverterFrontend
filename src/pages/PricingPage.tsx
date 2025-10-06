import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For casual users who need quick conversions.',
    features: ['5 conversions per day', 'Max 10MB file size', 'Standard conversion speed', 'Access to all basic formats'],
    cta: 'Start for Free',
    primary: false,
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'For professionals who need more power and flexibility.',
    features: ['Unlimited conversions', 'Max 1GB file size', 'Priority conversion speed', 'Batch processing', 'OCR for scanned PDFs', 'Priority support'],
    cta: 'Go Pro',
    primary: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    description: 'For teams and businesses with custom needs.',
    features: ['Everything in Pro', 'Team management', 'Custom integrations', 'Dedicated account manager', 'On-premise deployment'],
    cta: 'Contact Sales',
    primary: false,
  },
];

const PricingPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`flex flex-col h-full ${tier.primary ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== 'Contact Us' && <span className="text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.primary ? 'default' : 'outline'}>{tier.cta}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default PricingPage;