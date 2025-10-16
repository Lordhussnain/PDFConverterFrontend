import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import { Blogpost1 } from './pages/BlogPost';
import { Toaster } from "@/components/ui/sonner";
import MainLayout from './components/layout/MainLayout';
import BlogLayout from './components/layout/BlogLayout';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AuthInitializer from '@/components/AuthInitializer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import ConditionalRoute from '@/components/auth/ConditionalRoute';

function App() {
  return (
    <Router>
      <AuthInitializer>
        <div className="bg-background text-foreground">
          <Routes>
            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/job/:jobId" element={<JobPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route element={<PublicRoute />}>
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              </Route>
            </Route>

            {/* Conditional Route for Email Verification */}
            <Route element={<MainLayout />}>
              <Route element={<ConditionalRoute />}>
                <Route path="/verify-email" element={<VerifyEmailPage />} />
              </Route>
            </Route>

            {/* General Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/careers" element={<CareersPage />} />
            </Route>

            {/* Blog Layout Routes */}
            <Route element={<BlogLayout />}>
              <Route path="/blogpost" element={<Blogpost1 />} />
            </Route>
          </Routes>
          <Toaster richColors />
        </div>
      </AuthInitializer>
    </Router>
  );
}

export default App;