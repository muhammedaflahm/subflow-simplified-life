
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FeedbackSection from '@/components/FeedbackSection';
import { 
  CreditCard, 
  Bell, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap,
  Check,
  Star,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Globe,
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: CreditCard,
      title: "Smart Subscription Tracking",
      description: "AI-powered categorization and automatic renewal detection for all your subscriptions.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bell,
      title: "Intelligent Notifications",
      description: "Predictive alerts before renewals with personalized recommendations to optimize your spending.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time spending insights with machine learning trends and forecasting.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Cancellation Assistant",
      description: "One-click cancellation with automated scripts and direct provider integration.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Sync",
      description: "Seamless synchronization across all devices with offline capability and real-time updates.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Built with cutting-edge technology for instant loading and smooth interactions.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content: "SubSimplify's AI insights helped me save over $2,400 annually by identifying redundant subscriptions I completely forgot about!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Freelancer",
      company: "Design Studio",
      content: "The one-click cancellation feature is revolutionary. No more spending hours on hold or navigating confusing websites.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Student",
      company: "University",
      content: "As a student, every dollar counts. This app helped me optimize my streaming services and save money for textbooks.",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SubSimplify
              </span>
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                Free Forever
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth')} className="hover:bg-blue-50">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-lg border border-blue-100">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">100% Free Subscription Management</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 block">
              Digital Subscriptions
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to track, optimize, and cancel your recurring subscriptions. 
            Save money effortlessly with intelligent insights and automated management - completely free, forever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Unlimited subscriptions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/80 backdrop-blur-sm py-16 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600">Free platform</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">2min</div>
              <div className="text-gray-600">Setup time</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-600">User satisfaction</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-600">Happy users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary features designed to automate your subscription management and maximize your savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white/80 backdrop-blur-sm py-20 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by thousands worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join our community of smart savers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <FeedbackSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to simplify your subscriptions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their recurring payments with our free AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started for Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SubSimplify</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free subscription management platform helping users save money and take control of their recurring payments.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">GDPR</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>support@subsimplify.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Available Worldwide</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 SubSimplify. All rights reserved. Built with ❤️ for smart savers.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>100% Free</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span>Secure & Private</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
