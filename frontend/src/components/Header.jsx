import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import gsap from 'gsap';
import { Timeline } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(Timeline, useGSAP);

const Header = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '.link',
      {
        opacity: 0,
        transform: 'rotate(17deg)translate(0px,20px)',
      },
      {
        delay: 2,
        duration: 1,
        opacity: 1,
        transform: 'none',
        ease: 'cubic-bezier(.75,.02,.65,.9)',
      }
    );
  });
  return (
    <AppBar
      sx={{
        position: 'sticky',
        zIndex: '0',
        background: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden',
        height: '7vh',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Typography
            className='link'
            component='a'
            href='/features'
            sx={{
              textDecoration: 'none',
              fontFamily: 'Poppins',
              color: 'black',
            }}
          >
            Features
          </Typography>
          <Typography
            className='link'
            component='a'
            href='/solutions'
            sx={{
              textDecoration: 'none',
              fontFamily: 'Poppins',
              color: 'black',
            }}
          >
            Solutions
          </Typography>
        </Box>
        <Typography
          className='link'
          variant='h4'
          component='div'
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontFamily: 'Poppins',
            color: 'black',
          }}
        >
          DERM AI
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            className='link'
            href='/login'
            sx={{ color: 'black', fontFamily: 'Poppins' }}
          >
            Login
          </Button>
          <Button
            className='link'
            href='/signup'
            sx={{ color: 'black', fontFamily: 'Poppins' }}
          >
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
