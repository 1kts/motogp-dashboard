import React from 'react';

const CaseStudy = () => {
  return (
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
  );
};

export default CaseStudy;