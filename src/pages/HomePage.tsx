
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Code, 
  Lightbulb, 
  Award, 
  BarChart, 
  Brain, 
  Layers,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section with animated gradient background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-violet-900 animate-gradient-background"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499962384498-d44fd1599db9?ixlib=rb-4.0.3')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        {/* Animated particles effect */}
        <div id="particles-js" className="absolute inset-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              <TypeAnimation
                sequence={[
                  'Build Skills',
                  1000,
                  'Master Algorithms',
                  1000,
                  'Win Competitions',
                  1000
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
              />
            </div>
            
            <h2 className="text-xl md:text-2xl text-blue-100 mb-8 md:mb-10">
              Your journey to competitive programming excellence starts here
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-indigo-500/30">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/problems">
                  <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-100 hover:bg-purple-400/10 rounded-full px-8 py-6 text-lg">
                    Explore Problems
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={scrollToFeatures}
          >
            <ChevronDown className="w-10 h-10 text-white/70 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose CodeOlympiad</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Code className="h-8 w-8" />,
                title: "Curated Problem Sets",
                description: "Problems selected by olympiad experts, categorized by topics and difficulty levels."
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Adaptive Learning",
                description: "Personalized recommendations based on your strengths and weaknesses."
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: "Smart Hints",
                description: "Get AI-powered hints when you're stuck, without spoiling the solution."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="glass-card"
              >
                <Card className="h-full border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Topics Section with animation */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Master Key Topics</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { name: "Graph Algorithms", icon: Layers },
              { name: "Dynamic Programming", icon: Code },
              { name: "Data Structures", icon: BarChart },
              { name: "Number Theory", icon: Award },
              { name: "String Algorithms", icon: Code },
              { name: "Geometry", icon: Layers },
              { name: "Combinatorics", icon: Brain },
              { name: "Greedy Algorithms", icon: Award }
            ].map((topic, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(129, 81, 248, 0.25)"
                }}
                className="cursor-pointer"
              >
                <Card className="hover:border-purple-500/50 border border-white/10 bg-white/5 backdrop-blur-sm transition-colors cursor-pointer">
                  <CardContent className="flex items-center p-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                      <topic.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-200">{topic.name}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link to="/problems">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 group"
              >
                Browse All Problems
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Parallax effect */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')] bg-cover bg-fixed bg-center"></div>
        <div className="relative container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Olympiad Journey?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students preparing for IOI, ICPC, and other programming competitions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-900 hover:bg-blue-50 rounded-full px-10 py-6 text-lg font-semibold shadow-xl"
                >
                  Join Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Alex Johnson",
                role: "IOI Gold Medalist",
                text: "The problems and learning materials on this platform helped me improve my algorithm skills dramatically. I credit my IOI success to the structured approach."
              },
              {
                name: "Maria Garcia",
                role: "Computer Science Student",
                text: "As a beginner in competitive programming, I found the step-by-step courses incredibly helpful. The AI hints kept me moving forward when I was stuck."
              },
              {
                name: "David Kim",
                role: "ICPC Finalist",
                text: "The practice environment closely mimics actual competitions. My team used this platform extensively to prepare for ICPC, and we made it to the World Finals!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={item}
                className="glass-card"
              >
                <Card className="h-full border-0 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                      </div>
                      <p className="text-slate-300 mb-6 flex-grow">{testimonial.text}</p>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-indigo-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
