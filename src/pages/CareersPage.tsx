import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';

const jobOpenings = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
  },
  {
    title: 'DevOps Specialist',
    department: 'Engineering',
    location: 'New York, NY',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
  },
];

const CareersPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Join Our Team</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're building the future of document management. Help us create amazing products that people love.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        {jobOpenings.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2">
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.department}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>
                  Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default CareersPage;