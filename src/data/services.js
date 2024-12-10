import { TOWNSHIPS } from './townships';

// Define real emergency numbers
const EMERGENCY_NUMBERS = {
  police: '10111',
  ambulance: '10177',
  fire: '112',
  genderViolence: '0800428428',
  childline: '116',
  suicideHotline: '0800567567'
};

// Helper function to generate random offset
const randomOffset = (base = 0.05) => (Math.random() - 0.5) * base;

// Helper function to get real clinic numbers (example)
const getClinicNumber = (townshipName) => {
  const clinicNumbers = {
    'Alexandra': '011-882-1800',
    'Soweto': '011-988-1000',
    // Add more real clinic numbers
  };
  return clinicNumbers[townshipName] || '011-000-0000';
};

// Function to generate services for any township with real contact numbers
const generateServicesForTownship = (township) => {
  return {
    emergency: [
      {
        name: `${township.name} Police Services`,
        type: "emergency",
        phone: EMERGENCY_NUMBERS.police,
        description: "24/7 Emergency Police Services",
        coords: township.coords
      },
      {
        name: "Emergency Medical Services",
        type: "emergency",
        phone: EMERGENCY_NUMBERS.ambulance,
        description: "Ambulance and Medical Emergencies",
        coords: { 
          lat: township.coords.lat + randomOffset(), 
          lng: township.coords.lng + randomOffset() 
        }
      }
    ],
    medical: [
      {
        name: `${township.name} Community Clinic`,
        type: "medical",
        phone: getClinicNumber(township.name), // Function to get real clinic numbers
        description: "Public Healthcare Facility",
        coords: { 
          lat: township.coords.lat + randomOffset(), 
          lng: township.coords.lng + randomOffset() 
        }
      }
    ],
    // ...other service types...
  };
};

// Base services data
const baseServices = {
  emergency: [
    {
      name: "National Emergency Response",
      type: "emergency",
      phone: "10111",
      description: "National emergency services",
      coords: { lat: -26.2041, lng: 28.0473 }
    }
  ]
};

// Generate services based on township location
const generateAllServices = () => {
  let allServices = { ...baseServices };
  
  // For each township, generate local services
  Object.entries(TOWNSHIPS).forEach(([province, townships]) => {
    townships.forEach(township => {
      const localServices = generateServicesForTownship(township);
      
      // Merge local services with existing services
      Object.entries(localServices).forEach(([type, services]) => {
        if (!allServices[type]) allServices[type] = [];
        allServices[type] = [...allServices[type], ...services];
      });
    });
  });

  return allServices;
};

export const SERVICES = generateAllServices();
export { generateServicesForTownship };