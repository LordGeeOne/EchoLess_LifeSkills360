import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

function TownshipInfo() {
  const location = useLocation();
  const { townshipName, backgroundImage } = location.state || {};

  const townshipData = {
    demographics: {
      population: "156,000",
      medianAge: "24",
      households: "45,200",
      unemploymentRate: "34.2%",
      source: "Stats SA Census 2022"
    },
    health: {
      teenPregnancyRate: "12.8%",
      birthRate: "22.4 per 1,000",
      hivPrevalence: "18.2%",
      accessToHealthcare: "76%",
      source: "Department of Health Annual Report 2023"
    },
    education: {
      matricPassRate: "72.3%",
      schoolEnrollment: "94%",
      tertiaryEducation: "23%",
      literacyRate: "88.5%",
      source: "Department of Education Statistics 2023"
    },
    safety: {
      crimeRate: "386 per 100,000",
      commonCrimes: [
        "Property theft (42%)",
        "Assault (28%)",
        "Drug-related (18%)"
      ],
      policeStations: 3,
      source: "SAPS Crime Statistics 2023"
    },
    infrastructure: {
      waterAccess: "88%",
      electricity: "92%",
      wasteCollection: "76%",
      roadsPaved: "65%",
      source: "Municipal Infrastructure Report 2023"
    },
    socioEconomic: {
      povertyRate: "38.4%",
      averageIncome: "R3,200/month",
      informalSettlements: "22%",
      economicGrowth: "2.1%",
      source: "Municipal Economic Review 2023"
    }
  };

  const dataLinks = [
    {
      name: "Stats SA",
      url: "http://www.statssa.gov.za/"
    },
    {
      name: "SAPS Crime Statistics",
      url: "https://www.saps.gov.za/services/crimestats.php"
    },
    {
      name: "Department of Health",
      url: "http://www.health.gov.za/"
    },
    {
      name: "Municipal Data",
      url: "https://municipaldata.treasury.gov.za/"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative',
      zIndex: 1,
      fontFamily: 'Kanit, sans-serif' // Add base font family here
    }}>
      <Link 
        to="/"
        state={{ backgroundImage, townshipName }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#fff',
          textDecoration: 'none',
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
          fontSize: '1.1rem',
          fontFamily: 'inherit' // Inherit Kanit font
        }}
      >
        <FaArrowLeft /> Back to Scenarios
      </Link>

      <h1 style={{
        color: '#fff',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        fontFamily: 'inherit' // Inherit Kanit font
      }}>
        About {townshipName}
      </h1>

      {/* Remove individual fontFamily declarations since they're inherited */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {Object.entries(townshipData).map(([category, data]) => (
          <div
            key={category}
            style={{
              background: 'rgba(0, 0, 0, 0.4)', // Changed from 0.1 to 0.2
              backdropFilter: 'blur(10px)',
              padding: '2rem',
              borderRadius: '15px',
              color: '#fff'
            }}
          >
            <h2 style={{
              textTransform: 'capitalize',
              marginBottom: '1.5rem',
              color: '#4CAF50',
              fontFamily: 'inherit', // Add this to ensure Kanit font
              fontWeight: '500'      // Add weight for better readability
            }}>
              {category}
            </h2>
            
            {Object.entries(data).map(([key, value]) => {
              if (key === 'source') return null;
              if (Array.isArray(value)) {
                return (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      color: '#ddd',
                      textTransform: 'capitalize',
                      fontFamily: 'inherit' // Add this to ensure Kanit font
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {value.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    color: '#ddd',
                    textTransform: 'capitalize',
                    fontFamily: 'inherit' // Add this to ensure Kanit font
                  }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </h3>
                  <p style={{ 
                    fontSize: '1.2rem',
                    fontFamily: 'inherit' // Add this to ensure Kanit font
                  }}>
                    {value}
                  </p>
                </div>
              );
            })}
            
            <div style={{
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              color: '#aaa',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '1rem'
            }}>
              Source: {data.source}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.2)', // Changed from 0.1 to 0.2
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '15px',
        marginBottom: '2rem',
        fontFamily: 'inherit' // Inherit Kanit font
      }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Data Sources</h2>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {dataLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#4CAF50',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}
            >
              {link.name} <FaExternalLinkAlt size={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TownshipInfo;
