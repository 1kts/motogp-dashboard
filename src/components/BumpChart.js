import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Flag } from 'lucide-react';
import { raceResults2024 } from '../data/raceResults2024';

const BumpChart = ({ data, selectedSeason, selectedClass }) => {
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
        <Flag className="w-5 h-5 text-purple-500" />
        Evolució del Campionat - Cursa a Cursa ({selectedSeason})
      </h2>
      
      {selectedSeason === 2024 && selectedClass === 'MotoGP' ? (
        <div className="mb-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30">
          <p className="text-sm text-green-200">
            ✅ Dades reals del 2024: Sprint + Curses principals. El gràfic mostra l'evolució real dels punts cursa per cursa.
          </p>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
          <p className="text-sm text-yellow-200">
            ⚠️ Nota: Aquest gràfic simula l'evolució basant-se en els punts totals i victòries. 
            Dades reals només disponibles per MotoGP 2024.
          </p>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data.bumpData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="race" 
            stroke="#9CA3AF"
            label={{ value: 'Cursa', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            label={{ value: 'Punts Acumulats', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
            content={({ active, payload, label }) => {
              if (active && payload) {
                const raceIndex = label - 1;
                const raceName = selectedSeason === 2024 && selectedClass === 'MotoGP' 
                  ? Object.keys(raceResults2024)[raceIndex] 
                  : `Cursa ${label}`;
                
                return (
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <p className="font-bold text-white mb-2">{raceName}</p>
                    {payload
                      .sort((a, b) => b.value - a.value)
                      .map((entry, index) => (
                        <div key={entry.name} className="flex justify-between items-center gap-4">
                          <span className="text-sm" style={{ color: entry.color }}>
                            {index + 1}. {entry.name}
                          </span>
                          <span className="text-sm font-bold">{entry.value} pts</span>
                        </div>
                      ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {data.riders.map((rider, idx) => (
            <Line 
              key={rider}
              type="monotone" 
              dataKey={rider} 
              stroke={riderColors[rider] || `hsl(${idx * 36}, 70%, 60%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BumpChart;