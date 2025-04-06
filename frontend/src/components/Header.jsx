/* eslint-disable react/prop-types */
import { AppBar, Toolbar, Button, Typography, Box, useMediaQuery } from '@mui/material';
import gsap from 'gsap';
import { Timeline } from 'gsap/gsap-core';
import { useAuth } from '../context/AuthContext';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(Timeline, useGSAP);
import Magnet from './../animations/Animations/Magnet/Magnet'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";





const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();
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
  }, []);

  const Btn = ({ children, onClick }) => {
    return (
      <Magnet padding={20} disabled={false} magnetStrength={10}>
        <Button
          className='link'
          onClick={onClick}
          sx={{ color: 'black', fontFamily: 'Poppins' }}
        >
          {children}
        </Button>
      </Magnet>
    );
  }
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
          <Btn onClick={() => navigate('/')}  > Home</Btn>
          <Btn onClick={() => navigate('/features')} > Features</Btn>

        </Box>
        {useMediaQuery("(min-width:799px)") && <Typography

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
        </Typography>}

        <Box sx={{ display: 'flex', gap: 2 }}>
          {auth?.isLoggedIn ? (

            <>

              <Btn onClick={() => navigate("/chat")} > Go to Chat</Btn>
              <Btn onClick={(e) => {
                auth.logout();
              }}>Logout</Btn>
            </>) : (<>

              <Btn onClick={() => navigate('/login')} > Login</Btn>
              <Btn onClick={() => navigate('/signup')} > Signup</Btn>

            </>)}

        </Box>
      </Toolbar>
    </AppBar >
  );
};

export default Header;
