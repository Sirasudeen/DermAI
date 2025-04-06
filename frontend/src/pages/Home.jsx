import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import gsap from 'gsap';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainText from '../components/MainText/MainText';
import { Timeline } from 'gsap/gsap-core';
import { useAuth } from '../context/AuthContext';
import { useGSAP } from '@gsap/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(Timeline, useGSAP, TextPlugin);

const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const smallScreen = useMediaQuery("(min-width:799px)")
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 799px)", () => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.Logo',
        {
          opacity: '0',
          filter: 'blur(5px)',
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
          text: auth.isLoggedIn ? "Let's Chat" : "Get Started",
          ease: 'power1.inOut',
        },
        '<'
      );
      tl.to('.LogoText', {
        height: '0vh',
        overflow: 'hidden',
      });
    });
    mm.add("(max-width:800px)", () => {
      gsap.to(
        '.button',
        {
          duration: 1,
          text: auth.isLoggedIn ? "Let's Chat" : "Get Started",
          ease: 'power1.inOut',
        },
        '<'
      );
    })

  }, []);
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box
      sx={{
        margin: 0,
        p: 0,
        justifyContent: "center",
        alignItems: "center",
        width: '100vw',
      }}
    >
      {smallScreen && <Box
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
            fontSize: 'clamp(4rem,15vw,15rem)',
            fontFamily: 'Poppins',
            color: "black"
          }}
        >
          DERM AI
        </Typography>
      </Box>}

      <Box
        className='Section2'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',

          minWidth: '50vw',
          height: '80vh',
          marginLeft: "10%",
          marginRight: "10%",

          borderRadius: '60px',
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
              margin: "0 auto",
              fontSize: "clamp(0.8rem,min(3vh,1.5vw),1.5rem)",
              color: 'white',
              width: '70%',
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
          onClick={() => {
            auth.isLoggedIn ? navigate("/chat") : navigate('/login')
          }}
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
