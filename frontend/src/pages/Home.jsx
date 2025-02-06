import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import MainText from '../components/MainText/MainText';
import { Timeline } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(Timeline, useGSAP, TextPlugin);

const Home = () => {
  const navigate = useNavigate();
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
      y: '-=97vh',
      duration: 1.5,
      ease: 'cubic-bezier(0,1.37,.82,.6)',
    });

    tl.fromTo(
      '.SubText',
      {
        opacity: 0,
        y: 100,
      },
      {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'cubic-bezier(.75,.02,.65,.9)',
      }
    );
    tl.to(
      '.button',
      {
        duration: 1,
        text: 'Get Started',
        ease: 'power1.inOut',
      },
      '<'
    );
    tl.to('.LogoText', {
      height: '0vh',
      overflow: 'hidden',
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minWidth: '35em',
          height: '80vh',
          borderRadius: '60px',
          margin: '0 8em 8em 8em',
          background: 'url("landbg.jpg")',
          backgroundSize: 'cover',
          padding: '2em 1em 1em 1em',
        }}
      >
        <MainText
          text='Your AI Powered Dermatology Assistant'
          disabled={false}
          speed={1}
        />
        <Box sx={{ display: 'flex', overflow: 'hidden', marginTop: '2em' }}>
          <Typography
            className='SubText'
            sx={{
              fontFamily: 'Poppins',
              fontSize: '1.2em',
              color: 'white',
              width: '70vw',
              padding: '1em',
            }}
          >
            Get instant insights on skin conditions, treatments, and medical
            concepts with our intelligent chatbot. Ask anything about
            dermatology, and MedBot will guide you!
          </Typography>
        </Box>
        <Button
          className='button'
          variant='contained'
          sx={{
            height: '1.5em',
            borderRadius: '50px',
            fontSize: '1.5em',
            padding: '1em',
            fontFamily: 'Poppins',
            backgroundColor: '#E9ECF0FF',
            color: 'black',
            textTransform: 'none',
            marginTop: '2em',
          }}
        ></Button>
      </Box>
    </Box>
  );
};

export default Home;
