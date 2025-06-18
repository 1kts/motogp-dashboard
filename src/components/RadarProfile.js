import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

const RadarProfile = ({ data, selectedSeason }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-green-500" />
        Perfil Competitiu - Top 5 ({selectedSeason})
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="rider" stroke="#9CA3AF" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
          <Radar name="Victòries" dataKey="Victòries" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
          <Radar name="Podis" dataKey="Podis" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.3} />
          <Radar name="Poles" dataKey="Poles" stroke="#FFA500" fill="#FFA500" fillOpacity={0.3} />
          <Radar name="Punts" dataKey="Punts" stroke="#95E1D3" fill="#95E1D3" fillOpacity={0.3} />
          <Radar name="Regularitat" dataKey="Regularitat" stroke="#FFE66D" fill="#FFE66D" fillOpacity={0.3} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarProfile;