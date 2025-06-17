import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Trophy, Target, Timer, Flag } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';
import { raceResults2024 } from '../data/raceResults2024';

const MotoGPDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2024);
  const [selectedClass, setSelectedClass] = useState('MotoGP');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/RidersSummary.csv');
      const csvText = await response.text();
      
      const parsed = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      setData(parsed.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Carregant dades...</div>
      </div>
    );
  }

  // Filtrar dades per classe i temporada
  const filteredData = data.filter(d => d.class === selectedClass);
  
  // Preparar dades per al bump chart real
  const generateBumpChartData = () => {
    if (selectedSeason === 2024 && selectedClass === 'MotoGP') {
      // Utilitzem dades reals per 2024
      const races = Object.keys(raceResults2024);
      const riders = ['Jorge Martin', 'Francesco Bagnaia', 'Marc Marquez', 'Enea Bastianini', 'Brad Binder', 'Pedro Acosta'];
      
      let cumulativePoints = {};
      riders.forEach(rider => { cumulativePoints[rider] = 0; });
      
      const bumpData = [];
      
      races.forEach((race, index) => {
        const raceData = { race: index + 1, raceName: race };
        const sprintPoints = raceResults2024[race].sprint;
        const mainPoints = raceResults2024[race].main;
        
        // Afegim punts sprint + main als acumulats
        riders.forEach(rider => {
          cumulativePoints[rider] += (sprintPoints[rider] || 0) + (mainPoints[rider] || 0);
          raceData[rider] = cumulativePoints[rider];
        });
        
        bumpData.push(raceData);
      });
      
      return { bumpData, riders };
    } else {
      // Per altres temporades, utilitzem simulació
      const seasonData = filteredData.filter(d => d.season === selectedSeason);
      const sortedRiders = _.orderBy(seasonData, ['points'], ['desc']).slice(0, 10);
      
      const races = 20;
      const bumpData = [];
      
      for (let race = 1; race <= races; race++) {
        const raceData = { race };
        sortedRiders.forEach(rider => {
          const progressRatio = race / races;
          const pointsAtRace = Math.round(rider.points * progressRatio);
          const variation = rider.wins > 5 ? 0.15 : 0.05;
          const randomFactor = 1 + (Math.random() - 0.5) * variation;
          raceData[rider.rider_name] = Math.round(pointsAtRace * randomFactor);
        });
        bumpData.push(raceData);
      }
      
      return { bumpData, riders: sortedRiders.map(r => r.rider_name) };
    }
  };

  // Preparar dades per al scatter plot Consistency vs Glory
  const getConsistencyData = () => {
    const seasonData = filteredData.filter(d => d.season === selectedSeason);
    return seasonData.map(rider => ({
      name: rider.rider_name,
      wins: rider.wins,
      points: rider.points,
      podiums: rider.podium,
      avgPoints: rider.races_participated > 0 ? (rider.points / rider.races_participated).toFixed(1) : 0,
      team: rider.team
    })).filter(r => r.points > 50); // Només pilots amb més de 50 punts
  };

  // Preparar dades per al radar chart
  const getRadarData = () => {
    const seasonData = filteredData.filter(d => d.season === selectedSeason);
    const topRiders = _.orderBy(seasonData, ['points'], ['desc']).slice(0, 5);
    
    const maxWins = _.maxBy(seasonData, 'wins')?.wins || 1;
    const maxPodiums = _.maxBy(seasonData, 'podium')?.podium || 1;
    const maxPoles = _.maxBy(seasonData, 'pole')?.pole || 1;
    const maxPoints = _.maxBy(seasonData, 'points')?.points || 1;
    
    return topRiders.map(rider => ({
      rider: rider.rider_name,
      Victòries: (rider.wins / maxWins) * 100,
      Podis: (rider.podium / maxPodiums) * 100,
      Poles: (rider.pole / maxPoles) * 100,
      Punts: (rider.points / maxPoints) * 100,
      Regularitat: rider.races_participated > 0 ? ((rider.points / rider.races_participated) / 25) * 100 : 0
    }));
  };

  // Timeline històric
  const getTimelineData = () => {
    const riders = ['Jorge Martin', 'Francesco Bagnaia', 'Marc Marquez', 'Fabio Quartararo'];
    const seasons = _.range(2018, 2025);
    
    return seasons.map(season => {
      const seasonObj = { season };
      riders.forEach(rider => {
        const riderData = filteredData.find(d => d.rider_name === rider && d.season === season);
        seasonObj[rider] = riderData ? riderData.points : 0;
      });
      return seasonObj;
    });
  };

  const { bumpData, riders } = generateBumpChartData();
  const consistencyData = getConsistencyData();
  const radarData = getRadarData();
  const timelineData = getTimelineData();

  // Colors per pilots
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          MotoGP Evolution Dashboard
        </h1>
        <p className="text-gray-400">Anàlisi de la consistència vs l'espectacularitat en el campionat</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 outline-none"
        >
          {_.range(2018, 2026).reverse().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 outline-none"
        >
          <option value="MotoGP">MotoGP</option>
          <option value="Moto2">Moto2</option>
          <option value="Moto3">Moto3</option>
        </select>

        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'overview' ? 'bg-red-600' : 'bg-gray-800'}`}
          >
            Vista General
          </button>
          <button 
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'detailed' ? 'bg-red-600' : 'bg-gray-800'}`}
          >
            Anàlisi Detallada
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consistency vs Glory Chart */}
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
                  data={consistencyData} 
                  fill="#FF6B6B"
                  fillOpacity={0.8}
                >
                  {consistencyData.map((entry, index) => (
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

          {/* Radar Chart - Racing Profile */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Perfil Competitiu - Top 5 ({selectedSeason})
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
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

          {/* Timeline Evolution */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              Evolució Històrica dels Punts (2018-2024)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
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
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bump Chart Real */}
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
              <LineChart data={bumpData}>
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
                {riders.map((rider, idx) => (
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

          {/* Anàlisi Martín vs Bagnaia */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              Cas d'Estudi: Jorge Martín vs Francesco Bagnaia (2024)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Martín Stats */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-red-400">Jorge Martín - Campió 2024</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Punts totals:</span>
                    <span className="font-bold">508</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Victòries:</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Podis:</span>
                    <span className="font-bold">16/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mitjana punts/cursa:</span>
                    <span className="font-bold text-green-400">25.4</span>
                  </div>
                </div>
              </div>

              {/* Bagnaia Stats */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-blue-400">Francesco Bagnaia - Subcampió</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Punts totals:</span>
                    <span className="font-bold">498</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Victòries:</span>
                    <span className="font-bold text-yellow-400">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Podis:</span>
                    <span className="font-bold">17/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mitjana punts/cursa:</span>
                    <span className="font-bold">24.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-600/30">
              <h4 className="font-bold mb-2">💡 Conclusió:</h4>
              <p className="text-sm">
                Martín va guanyar el campionat amb només 3 victòries gràcies a la seva extraordinària consistència. 
                Mentre Bagnaia brillava els diumenges amb 11 victòries, Martín sumava punts constantment, 
                demostrant que en MotoGP la regularitat pot superar l'espectacularitat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotoGPDashboard;