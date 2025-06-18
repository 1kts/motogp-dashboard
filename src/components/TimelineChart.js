import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timer } from 'lucide-react';

const TimelineChart = ({ data }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 lg:col-span-2">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Timer className="w-5 h-5 text-blue-500" />
        Evolució Històrica dels Punts (2018-2024)
      </h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="season" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
          />
          <Legend />
          <Line type="monotone" dataKey="Jorge Martin" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Francesco Bagnaia" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Marc Marquez" stroke="#FFA500" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Fabio Quartararo" stroke="#C7CEEA" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;