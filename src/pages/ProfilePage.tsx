import { motion } from 'framer-motion';
import useAuthStore from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your account details.</p>
        </div>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-medium">{user.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${user.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </main>
  );
};

export default ProfilePage;