
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Code, 
  Award, 
  BarChart, 
  Brain, 
  Terminal,
  Layers,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-olympiad-800 to-olympiad-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Master Competitive Programming for Olympiads
              </h1>
              <p className="text-xl mb-8 text-olympiad-100">
                Join our platform to learn algorithms, practice problems, and prepare for informatics competitions.
              </p>
              <div className="flex space-x-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-olympiad-800 hover:bg-olympiad-100">
                    Get Started
                  </Button>
                </Link>
                <Link to="/problems">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Explore Problems
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <pre className="text-olympiad-100 overflow-x-auto">
                  <code>{`function solve(n, arr) {
  // Binary search implementation
  let low = 0, high = arr.length - 1;
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    
    if (arr[mid] === n) return mid;
    if (arr[mid] < n) low = mid + 1;
    else high = mid - 1;
  }
  
  return -1;
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CodeOlympiad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Curated Problem Sets</h3>
                  <p className="text-gray-600">
                    Problems selected by olympiad experts, categorized by topics and difficulty levels.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Adaptive Learning</h3>
                  <p className="text-gray-600">
                    Personalized recommendations based on your strengths and weaknesses.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Terminal className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Online Judge</h3>
                  <p className="text-gray-600">
                    Instant feedback on your solutions with detailed error reports and optimization tips.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Master Key Topics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Graph Algorithms", icon: Layers },
              { name: "Dynamic Programming", icon: Code },
              { name: "Data Structures", icon: BarChart },
              { name: "String Algorithms", icon: Terminal },
              { name: "Number Theory", icon: Award },
              { name: "Geometry", icon: CheckCircle2 },
              { name: "Combinatorics", icon: BookOpen },
              { name: "Greedy Algorithms", icon: Brain }
            ].map((topic, index) => (
              <Card key={index} className="hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                <CardContent className="flex items-center p-4">
                  <topic.icon className="h-5 w-5 mr-3 text-primary" />
                  <span className="font-medium">{topic.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/problems">
              <Button size="lg">
                Browse All Problems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Olympiad Journey?</h2>
          <p className="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students preparing for IOI, ICPC, and other programming competitions.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
