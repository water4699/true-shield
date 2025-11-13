// Contract addresses for different networks
export const CONTRACTS = {
  31337: { // Localhost
    GamePreferenceSurvey: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // Local Hardhat deployment
  },
  11155111: { // Sepolia
    GamePreferenceSurvey: '0x8Eb543d32bc1df0c7394e2eF9100BbF848EfCf62', // Deployed on Sepolia
  },
} as const;

// Contract ABI (simplified for frontend use)
export const GAME_PREFERENCE_SURVEY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "respondent",
        "type": "address"
      }
    ],
    "name": "ResponseSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "pvp",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "pve",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "economic",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "others",
        "type": "uint8"
      }
    ],
    "name": "ResultsDecrypted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      }
    ],
    "name": "SurveyClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "SurveyCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "closeSurvey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "requestDecryptionAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_durationInSeconds",
        "type": "uint256"
      }
    ],
    "name": "createSurvey",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAdmin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "getEncryptedTotals",
    "outputs": [
      {
        "internalType": "euint8",
        "name": "pvp",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "pve",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "economic",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "others",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "getSurvey",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalResponses",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSurveyCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_respondent",
        "type": "address"
      }
    ],
    "name": "hasResponded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "externalEuint8",
        "name": "inputPVP",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint8",
        "name": "inputPVE",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint8",
        "name": "inputEconomic",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint8",
        "name": "inputOthers",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "proofPVP",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "proofPVE",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "proofEconomic",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "proofOthers",
        "type": "bytes"
      }
    ],
    "name": "submitResponse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "surveyCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

