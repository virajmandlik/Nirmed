
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Recycle, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              WasteCare Healthcare Management
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional, Safe, and Sustainable Waste Disposal Solutions
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Safe Disposal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compliant with all healthcare waste regulations and safety protocols
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Recycle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Environmental Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sustainable practices that minimize environmental impact
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamless coordination between medical and disposal staff
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor waste disposal progress and environmental metrics
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Choose Your Role
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-blue-600">Medical Staff</CardTitle>
                <CardDescription>
                  Generate and track waste disposal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li>• Create disposal requests</li>
                  <li>• Track request status</li>
                  <li>• Access training modules</li>
                  <li>• View environmental impact</li>
                </ul>
                <Link to="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Join as Medical Staff
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-600">Disposal Staff</CardTitle>
                <CardDescription>
                  Process and complete disposal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li>• Process disposal requests</li>
                  <li>• Record disposal methods</li>
                  <li>• Generate compliance reports</li>
                  <li>• Track environmental metrics</li>
                </ul>
                <Link to="/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Join as Disposal Staff
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
