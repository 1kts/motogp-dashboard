import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';

const ConsistencyChart = ({ data, selectedSeason }) => {
  const riderColors = {
    'Jorge Martin': '#FF6B6B',
    'Francesco Bagnaia': '#4ECDC4',
    'Marc Marquez': '#FFA500',
    'Enea Bastianini': '#95E1D3',
    'Pedro Acosta': '#F38181',
    'Brad Binder': '#FFE66D',
    'Marco Bezzecchi': '#A8E6CF',
    'Fabio Quartararo': '#C7CEEA'
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Consistència vs Glòria ({selectedSeason})
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="wins" 
            name="Victòries" 
            stroke="#9CA3AF"
            label={{ value: 'Victòries', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            dataKey="points" 
            name="Punts" 
            stroke="#9CA3AF"
            label={{ value: 'Punts Totals', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <p className="font-bold text-white">{data.name}</p>
                    <p className="text-sm text-gray-400">{data.team}</p>
                    <p className="text-sm mt-1">Victòries: {data.wins}</p>
                    <p className="text-sm">Punts: {data.points}</p>
                    <p className="text-sm">Podis: {data.podiums}</p>
                    <p className="text-sm text-yellow-500">Mitjana: {data.avgPoints} punts/cursa</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            name="Pilots" 
            data={data} 
            fill="#FF6B6B"
            fillOpacity={0.8}
          >
            {data.map((entry, index) => (
              <circle key={`dot-${index}`} r={8} fill={riderColors[entry.name] || '#FF6B6B'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>📊 Els pilots a la part superior esquerra són consistents però menys espectaculars</p>
        <p>🏆 Els pilots a la dreta són més espectaculars amb moltes victòries</p>
      </div>
    </div>
  );
};

export default ConsistencyChart;