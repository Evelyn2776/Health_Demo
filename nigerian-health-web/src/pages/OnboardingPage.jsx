import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Container, Grid, useMediaQuery } from '@mui/material'
import { ArrowForward as ArrowIcon } from '@mui/icons-material'

// Leaf Icon for logo
function LeafIcon({ color = '#4CAF50', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill={color}/>
    </svg>
  )
}

// Natural leaf decoration
function LeafDecoration({ color = '#4CAF50', size = 40, rotation = 0 }) {
  return (
    <Box sx={{ display: 'inline-block', transform: `rotate(${rotation}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path d="M20 5C10 5 5 15 5 25C5 35 15 45 25 40C30 48 35 40 35 30C35 20 25 15 20 5Z" fill={color} opacity={0.85}/>
      </svg>
    </Box>
  )
}

// Pie Chart Icon
function PieChartIcon({ color = '#9C27B0', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 12L8 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// Star Icon
function StarIcon({ color = '#9C27B0', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill={color}/>
    </svg>
  )
}

// Feature Component
function Feature({ icon, text, color }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 70 }}>
      <Box sx={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        backgroundColor: 'rgba(156, 39, 176, 0.12)',
        border: '1.5px solid ' + color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 0.5,
      }}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ 
        color: color, 
        fontWeight: 500, 
        fontSize: '0.75rem',
        lineHeight: 1.3,
      }}>
        {text}
      </Typography>
    </Box>
  )
}

// Food Bowl Component - Using imageee.png
function FoodBowl({ size = 320 }) {
  return (
    <Box sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      border: '4px solid #fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box
        component="img"
        src="/uploads/imageee.png"
        alt="Nigerian Food Bowl with Jollof Rice, Grilled Chicken, Plantains, and Vegetables"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </Box>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMobile = useMediaQuery('(max-width:600px)')

  const slides = [
    { 
      title: 'Eat Nigerian. Eat Smart. Live Well.', 
      description: 'Track your favorite Nigerian meals' 
    },
    { 
      title: 'Smart Portion Control', 
      description: 'Know exactly what you\'re eating' 
    },
    { 
      title: 'Personalized Recommendations', 
      description: 'Get meal suggestions for your goals' 
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const currentSlideData = slides[currentSlide]
  const greenPrimary = '#4CAF50'
  const greenLight = '#E8F5E8'
  const purplePrimary = '#9C27B0'

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${greenLight} 0%, #C8E6C9 100%)`,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      px: 2,
    }}>

      {/* Leaf decorations */}
      <Box sx={{ 
        position: 'absolute', 
        top: isMobile ? '8%' : '12%', 
        left: isMobile ? '8%' : '12%', 
        zIndex: 1,
      }}>
        <LeafDecoration color={greenPrimary} size={isMobile ? 30 : 40} rotation={-15} />
      </Box>
      
      <Box sx={{ 
        position: 'absolute', 
        top: isMobile ? '10%' : '15%', 
        right: isMobile ? '10%' : '15%', 
        zIndex: 1,
      }}>
        <LeafDecoration color={greenPrimary} size={isMobile ? 30 : 40} rotation={25} />
      </Box>
      
      <Box sx={{ 
        position: 'absolute', 
        bottom: isMobile ? '28%' : '25%', 
        left: isMobile ? '5%' : '8%', 
        zIndex: 1,
      }}>
        <LeafDecoration color={greenPrimary} size={isMobile ? 25 : 35} rotation={-10} />
      </Box>
      
      <Box sx={{ 
        position: 'absolute', 
        bottom: isMobile ? '20%' : '18%', 
        right: isMobile ? '8%' : '12%', 
        zIndex: 1,
      }}>
        <LeafDecoration color={greenPrimary} size={isMobile ? 30 : 40} rotation={20} />
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="sm" sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        pt: isMobile ? 6 : 8,
        pb: isMobile ? 4 : 6,
        width: '100%',
        maxWidth: isMobile ? '100%' : '480px',
      }}>
        
        {/* Logo */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: isMobile ? 2 : 3,
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 700, 
            color: greenPrimary, 
            fontSize: isMobile ? '2rem' : '2.8rem',
            letterSpacing: '-0.5px',
          }}>
            Chop
          </Typography>
          <Box sx={{ mx: 1, transform: isMobile ? 'scale(1)' : 'scale(1.2)' }}>
            <LeafIcon color={purplePrimary} size={isMobile ? 36 : 48} />
          </Box>
          <Typography variant="h2" sx={{ 
            fontWeight: 700, 
            color: purplePrimary, 
            fontSize: isMobile ? '2rem' : '2.8rem',
            letterSpacing: '-0.5px',
          }}>
            Well
          </Typography>
        </Box>

        {/* Tagline */}
        <Typography variant="h5" sx={{
          color: '#555',
          fontWeight: 500,
          mb: isMobile ? 4 : 5,
          fontSize: isMobile ? '1rem' : '1.3rem',
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          Eat Nigerian. Eat Smart. Live Well.
        </Typography>

        {/* Features */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{
          justifyContent: 'center', 
          mb: isMobile ? 4 : 5,
          maxWidth: '400px',
        }}>
          <Grid item>
            <Feature
              icon={<LeafIcon color={purplePrimary} size={28} />}
              text="Healthy Nigerian Meals"
              color={purplePrimary}
            />
          </Grid>
          <Grid item>
            <Feature
              icon={<PieChartIcon color={purplePrimary} size={28} />}
              text="Smart Portioning"
              color={purplePrimary}
            />
          </Grid>
          <Grid item>
            <Feature
              icon={<StarIcon color={purplePrimary} size={28} />}
              text="Personalized Recommendations"
              color={purplePrimary}
            />
          </Grid>
        </Grid>

        {/* Food Bowl - CIRCULAR in the middle, fixed size */}
        <FoodBowl size={isMobile ? 240 : 320} />

        {/* Slide Content Card */}
        <Box sx={{
          mb: 3,
          mt: isMobile ? 3 : 4,
          p: isMobile ? 2 : 3,
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 3px 15px rgba(0, 0, 0, 0.08)',
          width: '100%',
          maxWidth: '360px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': { 
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.12)'
          },
        }} onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}>
          <Typography variant="h6" sx={{ 
            mb: 0.5, 
            color: '#333', 
            fontWeight: 600,
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            textAlign: 'center',
          }}>
            {currentSlideData.title}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#666', 
            textAlign: 'center',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
          }}>
            {currentSlideData.description}
          </Typography>
        </Box>

        {/* Dot Indicators */}
        <Box sx={{
          display: 'flex', 
          justifyContent: 'center', 
          gap: isMobile ? 0.5 : 1, 
          mb: isMobile ? 3 : 4,
        }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: isMobile ? 8 : 10,
                height: isMobile ? 8 : 10,
                borderRadius: '50%',
                background: currentSlide === index ? greenPrimary : '#E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: purplePrimary, 
                  transform: 'scale(1.15)' 
                },
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>

        {/* Get Started Button */}
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{
            background: greenPrimary,
            color: 'white',
            py: isMobile ? 1.2 : 1.5,
            px: isMobile ? 3 : 4,
            borderRadius: '28px',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
            '&:hover': { 
              background: '#388E3C', 
              boxShadow: '0 6px 18px rgba(76, 175, 80, 0.5)' 
            },
            transition: 'all 0.3s ease',
            minWidth: isMobile ? '200px' : '240px',
          }}
          endIcon={<ArrowIcon />}
        >
          Get Started
        </Button>

        {/* Skip Link */}
        <Button
          onClick={() => navigate('/dashboard')}
          sx={{
            mt: isMobile ? 2 : 2.5,
            color: purplePrimary,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            '&:hover': { 
              textDecoration: 'underline', 
              color: '#7B1FA2' 
            },
            transition: 'all 0.3s ease',
          }}
        >
          Skip
        </Button>
      </Container>
    </Box>
  )
}
