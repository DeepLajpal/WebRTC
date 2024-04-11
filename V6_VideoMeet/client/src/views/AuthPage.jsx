import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import GetSnackbar from '../Components/Common/getSnackbar';
import axios from 'axios';
import { useGlobalState } from '../ContextAPI/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function ColorSchemeToggle(props) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function JoySignInSignUpTemplate() {
  const { updateGlobalState } = useGlobalState();

  const [isSignIn, setIsSignIn] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleNavigation = (path, loggedInUserData) => {
    const data = { loggedInUserData: {...loggedInUserData}, name: loggedInUserData.firstName + ' ' + loggedInUserData.lastName, userId: loggedInUserData.id}

    updateGlobalState({ ...data });

    navigate(path);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const password = formElements.password.value;
    if (formElements.confirmPassword) {

      const confirmPassword = formElements.confirmPassword.value;

      if (password === confirmPassword) {
        const data = {
          firstName: formElements.firstName.value ? formElements.firstName.value : null,
          lastName: formElements.lastName.value ? formElements.lastName.value : null,
          email: formElements.email.value,
          password: password
        };
        try {
          const response = await axios.post('http://localhost:8080/api/register', data)
          setSnackbarMessage(response.data.message);
          setOpenSnackbar(true);
          setIsSignIn(true)
        } catch (err) {
          setSnackbarMessage(err.response.data.message);
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage("Password & Confirm Password do not match");
        setOpenSnackbar(true);
      }

    } else {
      const data = {
        email: formElements.email.value,
        password: password,
      };

      try {
        const response = await axios.post('http://localhost:8080/api/login', data)
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
        handleNavigation('/home', response.data.data)
      } catch (err) {
        setSnackbarMessage(err.response.data.message);
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Video Meet</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            {isSignIn ? (
              <Box>
                <Stack gap={4} sx={{ mb: 2 }}>
                  <Stack gap={1}>
                    <Typography component="h1" level="h3">
                      Sign in
                    </Typography>
                    <Typography level="body-sm">
                      New to Video Meet?{' '}
                      <Link href="#" level="title-sm" onClick={toggleForm}>
                        Sign up!
                      </Link>
                    </Typography>
                  </Stack>
                </Stack>
                <Divider
                  sx={(theme) => ({
                    [theme.getColorSchemeSelector('light')]: {
                      color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                  })}
                >
                  or
                </Divider>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <form onSubmit={handleSubmit}>
                    <FormControl required>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" name="email" />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" name="password" />
                    </FormControl>
                    <Stack gap={4} sx={{ mt: 2 }}>
                      <Button type="submit" fullWidth>
                        Sign in
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            ) : (
              <Box>
                <Stack gap={4} sx={{ mb: 2 }}>
                  <Stack gap={1}>
                    <Typography component="h1" level="h3">
                      Sign up
                    </Typography>
                    <Typography level="body-sm">
                      Already have an account?{' '}
                      <Link href="#" level="title-sm" onClick={toggleForm}>
                        Sign in!
                      </Link>
                    </Typography>
                  </Stack>

                </Stack>
                <Divider
                  sx={(theme) => ({
                    [theme.getColorSchemeSelector('light')]: {
                      color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                  })}
                >
                  or
                </Divider>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <form onSubmit={handleSubmit}>
                    <FormControl required>
                      <FormLabel>First Name</FormLabel>
                      <Input type="text" name="firstName" />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" name="lastName" />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Email </FormLabel>
                      <Input type="email" name="email" />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" name="password" />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input type="password" name="confirmPassword" />
                    </FormControl>
                    <Button type="submit" fullWidth>
                      Sign up
                    </Button>
                  </form>
                </Stack>
              </Box>
            )}
          </Box>
          <GetSnackbar
            open={openSnackbar}
            handleClose={handleSnackbarClose}
            message={snackbarMessage}
          />
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Video Meet {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
          },
        })}
      />
    </CssVarsProvider>
  );
}
