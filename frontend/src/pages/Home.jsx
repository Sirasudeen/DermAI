import { Box, Typography } from '@mui/material';
import Header from '../components/Header';
import gsap from 'gsap';
import { Timeline } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(Timeline, useGSAP);

const Home = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '.Logo',
      {
        opacity: '0',
        filter: 'blur(2px)',
      },
      {
        duration: 2,
        ease: 'cubic-bezier(.53,.15,.21,.92)',
        opacity: '1',
        filter: 'blur(0px)',
      }
    );
    tl.to('.Section2', {
      y: '-=100vh',
      duration: 2,
      ease: 'cubic-bezier(.75,.02,.65,.9)',
    });
  });
  return (
    <Box
      sx={{
        margin: 0,
        p: 0,
        width: '100vw',
      }}
    >
      <Header />
      <Box
        className='Logo'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          position: 'sticky',
        }}
      >
        <Typography
          className='LogoText'
          sx={{
            fontSize: '13em',
            fontFamily: 'Poppins',
          }}
        >
          DERM AI
        </Typography>
      </Box>
      <Box
        className='Section2'
        sx={{
          height: '100vh',
          background: 'pink',
        }}
      >
        <h1>Section 2</h1>
      </Box>
    </Box>
  );
};

export default Home;
