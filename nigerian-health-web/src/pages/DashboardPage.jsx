import { Typography, Container, Paper, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ color: '#9C27B0', mb: 2 }}>
          PortionPal Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome to your health dashboard!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ background: 'linear-gradient(135deg, #9C27B0, #8e24aa)' }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  )
}
