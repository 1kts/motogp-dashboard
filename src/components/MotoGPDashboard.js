import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Trophy, Target, Timer, Flag } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';
import { raceResults2024 } from '../data/raceResults2024';
import { raceResults2025 } from '../data/raceResults2025';

// Move constants outside component to prevent recreation
const RIDER_COLORS = {
  'Jorge Martin': '#FF6B6B',
  'Francesco Bagnaia': '#4ECDC4',
  'Marc Marquez': '#FFA500',
  'Alex Marquez': '#C9B037',
  'Enea Bastianini': '#95E1D3',
  'Pedro Acosta': '#F38181',
  'Brad Binder': '#FFE66D',
  'Marco Bezzecchi': '#A8E6CF',
  'Fabio Quartararo': '#C7CEEA',
  'Johann Zarco': '#B19CD9',
  'Franco Morbidelli': '#98D8C8',
  'Fabio di Giannantonio': '#F7DC6F',
  'Maverick Vinales': '#85C1E2',
  'Fermin Aldeguer': '#F8C471',
  'Ai Ogura': '#BB8FCE'
};

const MotoGPDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [selectedClass, setSelectedClass] = useState('MotoGP');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('overview');
  const [availableSeasons, setAvailableSeasons] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await window.fs.readFile('RidersSummary.csv', { encoding: 'utf8' });
      
      const parsed = Papa.parse(response, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      setData(parsed.data);
      
      const seasons = [...new Set(parsed.data.map(row => row.season))].filter(s => s).sort((a, b) => b - a);
      setAvailableSeasons(seasons);
      
      if (seasons.length > 0) {
        setSelectedSeason(seasons[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Memoize filtered data
  const filteredData = useMemo(() => 
    data.filter(d => d.class === selectedClass),
    [data, selectedClass]
  );

  // Memoize race name getter
  const getRaceName = useCallback((raceIndex) => {
    if (selectedSeason === 2024 && selectedClass === 'MotoGP') {
      return Object.keys(raceResults2024)[raceIndex];
    } else if (selectedSeason === 2025 && selectedClass === 'MotoGP') {
      return Object.keys(raceResults2025)[raceIndex];
    }
    return `Cursa ${raceIndex + 1}`;
  }, [selectedSeason, selectedClass]);

  // Memoize bump chart data generation
  const { bumpData, riders } = useMemo(() => {
    if (selectedSeason === 2024 && selectedClass === 'MotoGP') {
      const races = Object.keys(raceResults2024);
      const allRiders = new Set();
      
      races.forEach(race => {
        Object.keys(raceResults2024[race].sprint).forEach(rider => allRiders.add(rider));
        Object.keys(raceResults2024[race].main).forEach(rider => allRiders.add(rider));
      });
      
      const ridersList = Array.from(allRiders);
      let cumulativePoints = {};
      ridersList.forEach(rider => { cumulativePoints[rider] = 0; });
      
      const chartData = [];
      
      races.forEach((race, index) => {
        const raceData = { race: index + 1, raceName: race };
        const sprintPoints = raceResults2024[race].sprint;
        const mainPoints = raceResults2024[race].main;
        
        ridersList.forEach(rider => {
          cumulativePoints[rider] += (sprintPoints[rider] || 0) + (mainPoints[rider] || 0);
          raceData[rider] = cumulativePoints[rider];
        });
        
        chartData.push(raceData);
      });
      
      const sortedRiders = Object.entries(cumulativePoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([rider]) => rider);
      
      return { bumpData: chartData, riders: sortedRiders };
    } else if (selectedSeason === 2025 && selectedClass === 'MotoGP') {
      const races = Object.keys(raceResults2025);
      const allRiders = new Set();
      
      races.forEach(race => {
        Object.keys(raceResults2025[race].sprint).forEach(rider => allRiders.add(rider));
        Object.keys(raceResults2025[race].main).forEach(rider => allRiders.add(rider));
      });
      
      const ridersList = Array.from(allRiders);
      let cumulativePoints = {};
      ridersList.forEach(rider => { cumulativePoints[rider] = 0; });
      
      const chartData = [];
      
      races.forEach((race, index) => {
        const raceData = { race: index + 1, raceName: race };
        const sprintPoints = raceResults2025[race].sprint;
        const mainPoints = raceResults2025[race].main;
        
        ridersList.forEach(rider => {
          cumulativePoints[rider] += (sprintPoints[rider] || 0) + (mainPoints[rider] || 0);
          raceData[rider] = cumulativePoints[rider];
        });
        
        chartData.push(raceData);
      });
      
      const sortedRiders = Object.entries(cumulativePoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([rider]) => rider);
      
      return { bumpData: chartData, riders: sortedRiders };
    } else {
      const seasonData = filteredData.filter(d => d.season === selectedSeason);
      const sortedRiders = _.orderBy(seasonData, ['points'], ['desc']).slice(0, 10);
      
      const races = 20;
      const chartData = [];
      
      for (let race = 1; race <= races; race++) {
        const raceData = { race };
        sortedRiders.forEach(rider => {
          const progressRatio = race / races;
          const pointsAtRace = Math.round(rider.points * progressRatio);
          const variation = rider.wins > 5 ? 0.15 : 0.05;
          const randomFactor = 1 + (Math.random() - 0.5) * variation;
          raceData[rider.rider_name] = Math.round(pointsAtRace * randomFactor);
        });
        chartData.push(raceData);
      }
      
      return { bumpData: chartData, riders: sortedRiders.map(r => r.rider_name) };
    }
  }, [filteredData, selectedSeason, selectedClass]);

  // Memoize consistency data
  const consistencyData = useMemo(() => {
    const seasonData = filteredData.filter(d => d.season === selectedSeason);
    return seasonData.map(rider => ({
      name: rider.rider_name,
      wins: rider.wins,
      points: rider.points,
      podiums: rider.podium,
      avgPoints: rider.races_participated > 0 ? 
        (rider.points / rider.races_participated).toFixed(1) : 0,
      team: rider.team
    })).filter(r => r.points > 50);
  }, [filteredData, selectedSeason]);

  // Memoize radar data
  const radarData = useMemo(() => {
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
      Regularitat: rider.races_participated > 0 ? 
        ((rider.points / rider.races_participated) / 25) * 100 : 0
    }));
  }, [filteredData, selectedSeason]);

  // Memoize timeline data
  const timelineData = useMemo(() => {
    const riders = ['Jorge Martin', 'Francesco Bagnaia', 'Marc Marquez', 'Fabio Quartararo'];
    const timelineSeasons = availableSeasons.filter(s => s >= 2018 && s <= 2025);
    
    return timelineSeasons.map(season => {
      const seasonObj = { season };
      riders.forEach(rider => {
        const riderData = filteredData.find(d => d.rider_name === rider && d.season === season);
        seasonObj[rider] = riderData ? riderData.points : 0;
      });
      return seasonObj;
    });
  }, [filteredData, availableSeasons]);

  // Memoize handlers
  const handleSeasonChange = useCallback((e) => {
    setSelectedSeason(Number(e.target.value));
  }, []);

  const handleClassChange = useCallback((e) => {
    setSelectedClass(e.target.value);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Memoize custom tooltip component
  const BumpChartTooltip = useMemo(() => ({ active, payload, label }) => {
    if (active && payload) {
      const raceIndex = label - 1;
      const raceName = getRaceName(raceIndex);
      
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
  }, [getRaceName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Carregant dades...</div>
      </div>
    );
  }

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
          onChange={handleSeasonChange}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 outline-none"
        >
          {availableSeasons.map(year => (
            <option key={year} value={year}>
              {year} {year === 2025 ? '(En curs)' : ''}
            </option>
          ))}
        </select>

        <select 
          value={selectedClass} 
          onChange={handleClassChange}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 outline-none"
        >
          <option value="MotoGP">MotoGP</option>
          <option value="Moto2">Moto2</option>
          <option value="Moto3">Moto3</option>
        </select>

        <div className="flex gap-2">
          <button 
            onClick={() => handleViewModeChange('overview')}
            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'overview' ? 'bg-red-600' : 'bg-gray-800'}`}
          >
            Vista General
          </button>
          <button 
            onClick={() => handleViewModeChange('detailed')}
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
                          <p className="text-sm text-gray-300">Equip: {data.team}</p>
                          <p className="text-sm">Victòries: {data.wins}</p>
                          <p className="text-sm">Podis: {data.podiums}</p>
                          <p className="text-sm">Punts: {data.points}</p>
                          <p className="text-sm">Mitjana: {data.avgPoints} pts/cursa</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  data={consistencyData} 
                  fill="#FF6B6B"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart - Competitive Profiles */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Perfils Competitius - Top 5 ({selectedSeason})
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
                <Radar name="Regularitat" dataKey="Regularitat" stroke="#C7CEEA" fill="#C7CEEA" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bump Chart */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-purple-500" />
              Evolució del Campionat - Cursa a Cursa ({selectedSeason})
            </h2>
            {(selectedSeason === 2024 || selectedSeason === 2025) && selectedClass === 'MotoGP' ? (
              <div className="mb-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30">
                <p className="text-sm text-green-200">
                  ✅ Dades reals del {selectedSeason}: Sprint + Curses principals. 
                  {selectedSeason === 2025 && " Temporada en curs (8 de 22 curses completades)."}
                </p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
                <p className="text-sm text-yellow-200">
                  ⚠️ Nota: Aquest gràfic simula l'evolució basant-se en els punts totals i victòries. 
                  Dades reals només disponibles per MotoGP 2024 i 2025.
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
                  content={BumpChartTooltip}
                />
                <Legend />
                {riders.map((rider, index) => (
                  <Line 
                    key={rider}
                    type="monotone" 
                    dataKey={rider} 
                    stroke={RIDER_COLORS[rider] || `hsl(${index * 360 / riders.length}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Historical Timeline */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              Timeline Històric - Evolució 2018-2025
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="season" 
                  stroke="#9CA3AF"
                  label={{ value: 'Temporada', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  label={{ value: 'Punts Totals', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Jorge Martin" 
                  stroke="#FF6B6B" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Francesco Bagnaia" 
                  stroke="#4ECDC4" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Marc Marquez" 
                  stroke="#FFA500" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Fabio Quartararo" 
                  stroke="#C7CEEA" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Detailed Analysis View */
        <div className="space-y-6">
          {/* Case Study: Martin vs Bagnaia 2024 */}
          {selectedSeason === 2024 && selectedClass === 'MotoGP' && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Cas d'Estudi: Martin vs Bagnaia 2024</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Jorge Martin Stats */}
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-red-500 mb-4">Jorge Martín</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Victòries</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Podis</span>
                      <span className="font-bold">16</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Punts totals</span>
                      <span className="font-bold text-green-400">508</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mitjana punts/cursa</span>
                      <span className="font-bold">25.4</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-200">
                      🏆 Campió del Món 2024
                    </p>
                  </div>
                </div>

                {/* Francesco Bagnaia Stats */}
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Francesco Bagnaia</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Victòries</span>
                      <span className="font-bold">11</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Podis</span>
                      <span className="font-bold">16</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Punts totals</span>
                      <span className="font-bold">498</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mitjana punts/cursa</span>
                      <span className="font-bold">24.9</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-200">
                      🥈 Subcampió (−10 punts)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 p-6 rounded-lg">
                <h4 className="font-bold mb-3">Anàlisi de la paradoxa</h4>
                <p className="text-gray-300 mb-3">
                  La temporada 2024 va demostrar que la consistència pot superar l'espectacularitat. 
                  Mentre Bagnaia va aconseguir 11 victòries (el 55% de les curses), Martín va guanyar 
                  el campionat amb només 3 victòries gràcies a:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Regularitat excepcional: sempre als punts</li>
                  <li>Gestió de riscos superior en moments clau</li>
                  <li>Maximització dels punts en curses sprint</li>
                  <li>Només 1 abandonament vs 4 de Bagnaia</li>
                </ul>
              </div>
            </div>
          )}

          {/* Season Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Líder actual</p>
              <p className="text-2xl font-bold">
                {riders[0] || 'N/A'}
              </p>
              <p className="text-sm text-green-400 mt-2">
                {bumpData.length > 0 ? bumpData[bumpData.length - 1][riders[0]] : 0} punts
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Total de curses</p>
              <p className="text-2xl font-bold">
                {selectedSeason === 2025 ? '8 de 22' : selectedSeason === 2024 ? '20' : '20'}
              </p>
              <p className="text-sm text-blue-400 mt-2">
                {selectedSeason === 2025 ? '36%' : '100%'} completat
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Diferència líder-segon</p>
              <p className="text-2xl font-bold">
                {bumpData.length > 0 && riders.length > 1 ? 
                  Math.abs(bumpData[bumpData.length - 1][riders[0]] - bumpData[bumpData.length - 1][riders[1]]) : 0} pts
              </p>
              <p className="text-sm text-yellow-400 mt-2">
                {selectedSeason === 2025 ? 'En disputa' : 'Final'}
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Guanyadors diferents</p>
              <p className="text-2xl font-bold">
                {consistencyData.filter(r => r.wins > 0).length}
              </p>
              <p className="text-sm text-purple-400 mt-2">
                pilots amb victòries
              </p>
            </div>
          </div>

          {/* Performance Metrics Table */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Mètriques de Rendiment - Top 10</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Pilot</th>
                    <th className="text-center py-3 px-4">Punts</th>
                    <th className="text-center py-3 px-4">Victòries</th>
                    <th className="text-center py-3 px-4">Podis</th>
                    <th className="text-center py-3 px-4">Poles</th>
                    <th className="text-center py-3 px-4">Mitjana</th>
                  </tr>
                </thead>
                <tbody>
                  {consistencyData.slice(0, 10).map((rider, idx) => (
                    <tr key={rider.name} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{idx + 1}.</span>
                          <span className="font-medium">{rider.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 font-bold">{rider.points}</td>
                      <td className="text-center py-3 px-4">{rider.wins}</td>
                      <td className="text-center py-3 px-4">{rider.podiums}</td>
                      <td className="text-center py-3 px-4">
                        {filteredData.find(d => d.rider_name === rider.name && d.season === selectedSeason)?.pole || 0}
                      </td>
                      <td className="text-center py-3 px-4 text-green-400">{rider.avgPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotoGPDashboard;