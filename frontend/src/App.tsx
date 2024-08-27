import React, { useState, useRef } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress, Snackbar } from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundImage: 'url(https://images.unsplash.com/photo-1466477234737-8a3b3faed8c3?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ3OTk4ODB8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '300px',
}));

const ChatBubble = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '20px',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  maxWidth: '80%',
  alignSelf: 'flex-end',
}));

interface FormData {
  text: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { control, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.text.trim()) {
      setMessages([...messages, data.text]);
      setIsLoading(true);
      try {
        const result = await backend.convertTextToSpeech(data.text, currentLanguage);
        if (result && typeof result === 'string') {
          setAudioSrc(result);
          console.log('Received audio data:', result);
        } else {
          throw new Error('Invalid audio data received');
        }
      } catch (error) {
        console.error('Error converting text to speech:', error);
        setError('Error converting text to speech: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
      reset();
    }
  };

  const playAudio = () => {
    if (audioSrc && audioRef.current) {
      try {
        console.log('Audio source:', audioSrc);
        if (typeof audioSrc !== 'string') {
          throw new Error('Audio source is not a string');
        }
        // Extract the base64 data from the data URL
        const [, base64Data] = audioSrc.split(',');
        if (!base64Data) {
          throw new Error('Invalid audio data format');
        }
        // Decode the base64 string
        const decodedData = atob(base64Data);
        // Create a Uint8Array from the decoded data
        const uintArray = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
          uintArray[i] = decodedData.charCodeAt(i);
        }
        // Create a Blob from the Uint8Array
        const blob = new Blob([uintArray], { type: 'audio/mp3' });
        // Create an object URL from the Blob
        const objectUrl = URL.createObjectURL(blob);
        // Set the object URL as the audio source
        audioRef.current.src = objectUrl;
        audioRef.current.play().catch(e => {
          console.error('Error playing audio:', e);
          setError('Error playing audio: ' + e.message);
        });
      } catch (error) {
        console.error('Error processing audio data:', error);
        setError('Error processing audio data: ' + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      setError('No audio data available');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 3 }}>
        Text to Speech App
      </Typography>
      <StyledPaper elevation={3}>
        <Box display="flex" flexDirection="column" height="300px" overflow="auto" mb={2}>
          {messages.map((msg, index) => (
            <ChatBubble key={index}>{msg}</ChatBubble>
          ))}
        </Box>
      </StyledPaper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center">
          <Controller
            name="text"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                placeholder="Type your text here"
                disabled={isLoading}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            disabled={isLoading}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </form>
      <Box display="flex" justifyContent="space-between" mt={2}>
        {['english', 'spanish', 'german'].map((lang) => (
          <Button
            key={lang}
            variant={currentLanguage === lang ? 'contained' : 'outlined'}
            onClick={() => setCurrentLanguage(lang)}
            disabled={isLoading}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </Button>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <PlayArrowIcon />}
          disabled={isLoading || !audioSrc}
          onClick={playAudio}
        >
          {isLoading ? 'Converting...' : 'Play'}
        </Button>
      </Box>
      <audio ref={audioRef} style={{ display: 'none' }} />
      <Typography variant="caption" display="block" align="center" mt={2}>
        Background image by{' '}
        <a href="https://unsplash.com/photos/polar-bear-in-body-of-water-photography-LfGqCrLmhp0" target="_blank" rel="noopener noreferrer">
          Unsplash
        </a>
      </Typography>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
};

export default App;
