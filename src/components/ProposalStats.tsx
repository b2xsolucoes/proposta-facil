
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProposalStatsProps {
  data: {
    weekly: Array<{ name: string; enviadas: number; aceitas: number }>;
    monthly: Array<{ name: string; enviadas: number; aceitas: number }>;
  };
}

const ProposalStats = ({ data }: ProposalStatsProps) => {
  const [activeTab, setActiveTab] = useState("weekly");
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-md p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-blue-500">Enviadas: {payload[0].value}</p>
          <p className="text-green-500">Aceitas: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propostas</CardTitle>
        <CardDescription>Análise de propostas enviadas e aceitas</CardDescription>
        <Tabs 
          defaultValue="weekly" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={activeTab === "weekly" ? data.weekly : data.monthly}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="enviadas" fill="#4285F4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aceitas" fill="#34A853" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProposalStats;
