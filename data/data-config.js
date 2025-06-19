// data-config.js
// Configuració de dades per al MotoGP Dashboard
// Actualitza aquest fitxer per afegir noves curses o modificar resultats

const MotoGPData = {
    // Dades temporada 2024 (completa)
    season2024: {
        races: ['QAT', 'POR', 'AME', 'ESP', 'FRA', 'CAT', 'ITA', 'NED', 'GER', 'GBR', 'AUT', 'ARA', 'RSM', 'EMI', 'IND', 'JPN', 'AUS', 'THA', 'MAL', 'SLD'],
        raceNames: {
            'QAT': 'Qatar',
            'POR': 'Portugal',
            'AME': 'Amèriques',
            'ESP': 'Espanya',
            'FRA': 'França',
            'CAT': 'Catalunya',
            'ITA': 'Itàlia',
            'NED': 'Països Baixos',
            'GER': 'Alemanya',
            'GBR': 'Gran Bretanya',
            'AUT': 'Àustria',
            'ARA': 'Aragó',
            'RSM': 'San Marino',
            'EMI': 'Emilia-Romagna',
            'IND': 'Indonèsia',
            'JPN': 'Japó',
            'AUS': 'Austràlia',
            'THA': 'Tailàndia',
            'MAL': 'Malàisia',
            'SLD': 'Solidaritat (Barcelona)'
        },
        riders: {
            'Jorge Martín': {
                positions: [1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                color: '#ff0000',
                team: 'Prima Pramac Racing',
                manufacturer: 'Ducati',
                points: 508,
                wins: 3,
                podiums: 16,
                poles: 6
            },
            'Francesco Bagnaia': {
                positions: [2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                color: '#dc0000',
                team: 'Ducati Lenovo Team',
                manufacturer: 'Ducati',
                points: 498,
                wins: 11,
                podiums: 18,
                poles: 6
            },
            'Marc Márquez': {
                positions: [5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                color: '#ff6b00',
                team: 'Gresini Racing',
                manufacturer: 'Ducati',
                points: 392,
                wins: 3,
                podiums: 13,
                poles: 1
            },
            'Enea Bastianini': {
                positions: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                color: '#dc0000',
                team: 'Ducati Lenovo Team',
                manufacturer: 'Ducati',
                points: 386,
                wins: 2,
                podiums: 11,
                poles: 0
            },
            'Brad Binder': {
                positions: [6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                color: '#ff5722',
                team: 'Red Bull KTM Factory Racing',
                manufacturer: 'KTM',
                points: 217,
                wins: 0,
                podiums: 2,
                poles: 0
            },
            'Pedro Acosta': {
                positions: [9, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                color: '#002f87',
                team: 'Red Bull GASGAS Tech3',
                manufacturer: 'KTM',
                points: 209,
                wins: 0,
                podiums: 5,
                poles: 0
            },
            'Maverick Viñales': {
                positions: [8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
                color: '#00af00',
                team: 'Aprilia Racing',
                manufacturer: 'Aprilia',
                points: 189,
                wins: 1,
                podiums: 4,
                poles: 1
            },
            'Aleix Espargaró': {
                positions: [10, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                color: '#00af00',
                team: 'Aprilia Racing',
                manufacturer: 'Aprilia',
                points: 179,
                wins: 0,
                podiums: 2,
                poles: 1
            },
            'Fabio Di Giannantonio': {
                positions: [7, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                color: '#ffff00',
                team: 'VR46 Racing Team',
                manufacturer: 'Ducati',
                points: 165,
                wins: 0,
                podiums: 1,
                poles: 0
            },
            'Alex Márquez': {
                positions: [3, 6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                color: '#ff6b00',
                team: 'Gresini Racing',
                manufacturer: 'Ducati',
                points: 163,
                wins: 0,
                podiums: 2,
                poles: 0
            },
            'Marco Bezzecchi': {
                positions: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
                color: '#ffff00',
                team: 'VR46 Racing Team',
                manufacturer: 'Ducati',
                points: 153,
                wins: 0,
                podiums: 2,
                poles: 0
            },
            'Fabio Quartararo': {
                positions: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                color: '#0000ff',
                team: 'Monster Energy Yamaha MotoGP',
                manufacturer: 'Yamaha',
                points: 113,
                wins: 0,
                podiums: 0,
                poles: 0
            }
        }
    },
    
    // Dades temporada 2025 (parcial - actualitzar després de cada cursa)
    season2025: {
        races: ['QAT', 'POR', 'AME', 'ESP', 'FRA', 'ITA', 'NED', 'GER'],
        raceNames: {
            'QAT': 'Qatar',
            'POR': 'Portugal',
            'AME': 'Amèriques',
            'ESP': 'Espanya',
            'FRA': 'França',
            'ITA': 'Itàlia',
            'NED': 'Països Baixos',
            'GER': 'Alemanya'
        },
        riders: {
            'Marc Márquez': {
                positions: [1, 1, 1, 1, 1, 1, 1, 1],
                color: '#dc0000',
                team: 'Ducati Lenovo Team',
                manufacturer: 'Ducati',
                points: 179,
                wins: 4,
                podiums: 7,
                poles: 3
            },
            'Alex Márquez': {
                positions: [2, 2, 2, 2, 2, 3, 3, 2],
                color: '#ff6b00',
                team: 'BK8 Gresini Racing',
                manufacturer: 'Ducati',
                points: 155,
                wins: 1,
                podiums: 6,
                poles: 1
            },
            'Francesco Bagnaia': {
                positions: [3, 3, 3, 3, 10, 2, 2, 3],
                color: '#dc0000',
                team: 'Ducati Lenovo Team',
                manufacturer: 'Ducati',
                points: 145,
                wins: 1,
                podiums: 5,
                poles: 2
            },
            'Enea Bastianini': {
                positions: [4, 4, 4, 4, 3, 4, 4, 4],
                color: '#ffff00',
                team: 'Tech3 KTM Factory Racing',
                manufacturer: 'KTM',
                points: 125,
                wins: 0,
                podiums: 3,
                poles: 0
            },
            'Jorge Martín': {
                positions: [5, 5, 5, 5, 4, 5, 5, 5],
                color: '#00af00',
                team: 'Aprilia Racing',
                manufacturer: 'Aprilia',
                points: 118,
                wins: 0,
                podiums: 2,
                poles: 1
            },
            'Marco Bezzecchi': {
                positions: [8, 7, 6, 6, 5, 6, 6, 6],
                color: '#00af00',
                team: 'Aprilia Racing',
                manufacturer: 'Aprilia',
                points: 110,
                wins: 1,
                podiums: 2,
                poles: 0
            },
            'Fabio Quartararo': {
                positions: [10, 8, 7, 7, 6, 7, 7, 7],
                color: '#0000ff',
                team: 'Monster Energy Yamaha MotoGP',
                manufacturer: 'Yamaha',
                points: 95,
                wins: 0,
                podiums: 1,
                poles: 2
            },
            'Johann Zarco': {
                positions: [15, 12, 10, 8, 7, 8, 8, 8],
                color: '#ff0000',
                team: 'LCR Honda',
                manufacturer: 'Honda',
                points: 88,
                wins: 1,
                podiums: 1,
                poles: 0
            },
            'Brad Binder': {
                positions: [7, 9, 8, 9, 8, 9, 9, 9],
                color: '#ff5722',
                team: 'Red Bull KTM Factory Racing',
                manufacturer: 'KTM',
                points: 82,
                wins: 0,
                podiums: 0,
                poles: 0
            },
            'Pedro Acosta': {
                positions: [6, 6, 9, 10, 9, 10, 10, 10],
                color: '#ff5722',
                team: 'Red Bull KTM Factory Racing',
                manufacturer: 'KTM',
                points: 78,
                wins: 0,
                podiums: 1,
                poles: 0
            },
            'Maverick Viñales': {
                positions: [11, 11, 11, 11, 11, 11, 11, 11],
                color: '#0000ff',
                team: 'Monster Energy Yamaha MotoGP',
                manufacturer: 'Yamaha',
                points: 65,
                wins: 0,
                podiums: 0,
                poles: 0
            },
            'Fabio Di Giannantonio': {
                positions: [9, 10, 12, 12, 12, 12, 12, 12],
                color: '#ffff00',
                team: 'Pertamina VR46 Racing Team',
                manufacturer: 'Ducati',
                points: 58,
                wins: 0,
                podiums: 0,
                poles: 0
            }
        }
    },
    
    // Configuració addicional
    config: {
        // Colors per manufacturer
        manufacturerColors: {
            'Ducati': '#dc0000',
            'KTM': '#ff5722',
            'Aprilia': '#00af00',
            'Yamaha': '#0000ff',
            'Honda': '#ff0000'
        },
        
        // Informació de circuits
        circuits: {
            'QAT': { name: 'Losail International Circuit', country: 'Qatar' },
            'POR': { name: 'Autódromo Internacional do Algarve', country: 'Portugal' },
            'AME': { name: 'Circuit of The Americas', country: 'USA' },
            'ESP': { name: 'Circuito de Jerez', country: 'Espanya' },
            'FRA': { name: 'Le Mans', country: 'França' },
            'CAT': { name: 'Circuit de Barcelona-Catalunya', country: 'Catalunya' },
            'ITA': { name: 'Mugello', country: 'Itàlia' },
            'NED': { name: 'TT Circuit Assen', country: 'Països Baixos' },
            'GER': { name: 'Sachsenring', country: 'Alemanya' },
            'GBR': { name: 'Silverstone Circuit', country: 'Gran Bretanya' },
            'AUT': { name: 'Red Bull Ring', country: 'Àustria' },
            'ARA': { name: 'MotorLand Aragón', country: 'Espanya' },
            'RSM': { name: 'Misano World Circuit', country: 'San Marino' },
            'EMI': { name: 'Misano World Circuit', country: 'Itàlia' },
            'IND': { name: 'Mandalika Circuit', country: 'Indonèsia' },
            'JPN': { name: 'Twin Ring Motegi', country: 'Japó' },
            'AUS': { name: 'Phillip Island', country: 'Austràlia' },
            'THA': { name: 'Chang International Circuit', country: 'Tailàndia' },
            'MAL': { name: 'Sepang International Circuit', country: 'Malàisia' },
            'SLD': { name: 'Circuit de Barcelona-Catalunya', country: 'Catalunya' }
        }
    }
};