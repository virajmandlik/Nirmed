
import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Clock, CheckCircle } from 'lucide-react';

const Training = () => {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const trainingModules = [
    {
      id: '1',
      title: 'Waste Categorization Fundamentals',
      description: 'Learn to properly classify different types of medical waste',
      duration: '45 minutes',
      difficulty: 'Beginner',
      progress: 100,
      completed: true,
      topics: [
        'Biohazardous waste identification',
        'Pharmaceutical waste classification',
        'Chemical waste handling',
        'General medical waste'
      ]
    },
    {
      id: '2',
      title: 'Safety Protocols and PPE',
      description: 'Essential safety procedures and protective equipment usage',
      duration: '30 minutes',
      difficulty: 'Beginner',
      progress: 60,
      completed: false,
      topics: [
        'Personal protective equipment',
        'Handling procedures',
        'Emergency protocols',
        'Exposure management'
      ]
    },
    {
      id: '3',
      title: 'Environmental Impact Assessment',
      description: 'Understanding the environmental effects of waste disposal methods',
      duration: '60 minutes',
      difficulty: 'Intermediate',
      progress: 0,
      completed: false,
      topics: [
        'Carbon footprint analysis',
        'Sustainable disposal methods',
        'Environmental regulations',
        'Impact reduction strategies'
      ]
    },
    {
      id: '4',
      title: user?.role === 'disposal' ? 'Advanced Disposal Techniques' : 'Regulatory Compliance',
      description: user?.role === 'disposal' 
        ? 'Advanced methods for safe and efficient waste disposal'
        : 'Understanding healthcare waste regulations and compliance requirements',
      duration: '90 minutes',
      difficulty: 'Advanced',
      progress: 25,
      completed: false,
      topics: user?.role === 'disposal' 
        ? [
            'Incineration protocols',
            'Chemical treatment methods',
            'Waste tracking systems',
            'Quality assurance'
          ]
        : [
            'Federal regulations (DOT, EPA)',
            'State and local requirements',
            'Documentation standards',
            'Audit procedures'
          ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalProgress = trainingModules.reduce((sum, module) => sum + module.progress, 0) / trainingModules.length;
  const completedModules = trainingModules.filter(m => m.completed).length;

  return (
    <Layout title="Training Center">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Center</h1>
          <p className="text-gray-600">Enhance your waste management knowledge and skills</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedModules}/{trainingModules.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{completedModules}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12h</div>
            </CardContent>
          </Card>
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trainingModules.map((module) => (
            <Card key={module.id} className={`cursor-pointer transition-all hover:shadow-lg ${
              module.completed ? 'border-green-200 bg-green-50' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="mt-2">{module.description}</CardDescription>
                  </div>
                  {module.completed && (
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <span className="text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {module.duration}
                      </span>
                    </div>
                    <span className="font-medium">{module.progress}%</span>
                  </div>

                  <Progress value={module.progress} />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Topics covered:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {module.topics.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    {module.completed ? (
                      <Button variant="outline" className="flex-1">
                        Review Module
                      </Button>
                    ) : module.progress > 0 ? (
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Continue Learning
                      </Button>
                    ) : (
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        Start Module
                      </Button>
                    )}
                    {module.completed && (
                      <Button variant="outline" size="sm">
                        <Award className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certification Section */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications & Achievements</CardTitle>
            <CardDescription>
              Your earned certificates and training achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-medium">Waste Classification Expert</h3>
                <p className="text-sm text-gray-600">Earned: May 15, 2024</p>
              </div>
              
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center opacity-50">
                <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-400">Safety Protocols Certified</h3>
                <p className="text-sm text-gray-400">Complete safety training</p>
              </div>
              
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center opacity-50">
                <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-400">Environmental Steward</h3>
                <p className="text-sm text-gray-400">Complete all modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Training;
