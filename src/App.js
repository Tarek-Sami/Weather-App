import './App.css';
// React import
import { useEffect, useState } from 'react';
// materual-ui components import
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// Material-ui icons import
import CloudIcon from '@mui/icons-material/Cloud';
// External libraries import
import axios from 'axios';
import moment from 'moment/moment';
import 'moment/min/locales';
import { useTranslation } from 'react-i18next';

// Set moment locale to Arabic (Egypt)

let cancelAxios = null;
const theme = createTheme({
  typography: {
    fontFamily: ['tajawal'],
  },
});
function App() {
  // States
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState('ar');
  const [dateAndTime, setDateAndTime] = useState('');
  const [direction, setDirection] = useState('rtl');
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState({
    currentTemp: null,
    discreption: '',
    min: null,
    max: null,
    icon: '',
  });
  // Event Handlers
  function handleLanguageClick() {
    if (locale === 'ar') {
      setLocale('en');
      i18n.changeLanguage('en');
      moment.locale('en');
      setDateAndTime(moment().format('dddd') + ' ' + moment().format('LL'));
      setDirection('ltr');
    } else {
      setLocale('ar');
      i18n.changeLanguage('ar');
      moment.locale('ar');
      setDateAndTime(moment().format('dddd') + ' ' + moment().format('LL'));
      setDirection('rtl');
    }
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
    setDateAndTime(moment().format('dddd') + ' ' + moment().format('LL'));
    axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather?lat=30.033333&lon=31.233334&appid=aa65649043192dd14501457214192f84',

        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        console.log(response);
        const responseTemp = Math.round(response.data.main.temp - 273.15);
        const responseDiscrertion = response.data.weather[0].description;
        const responseMin = Math.round(response.data.main.temp_min - 273.15);
        const responseMax = Math.round(response.data.main.temp_max - 273.15);
        const responseIcon = response.data.weather[0].icon;
        setTemp({
          currentTemp: responseTemp,
          discreption: responseDiscrertion,
          min: responseMin,
          max: responseMax,
          icon: responseIcon,
        });
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

    return () => {
      cancelAxios();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <Card
          maxWidth="sm"
          dir={direction}
          style={{
            background: 'rgb(28 52 91 / 36%)',
            borderRadius: '15px',
            boxShadow: '0px 11px 15px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent>
            {/* City & Time */}
            <div
              dir={direction}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'end',
                justifyContent: 'start',
              }}
            >
              <Typography
                variant="h2"
                style={{
                  marginLeft: '10px',
                  marginRight: '20px',
                  fontWeight: '600',
                }}
              >
                {t('Cairo')}
              </Typography>
              <Typography variant="h5" style={{ marginRight: '20px' }}>
                {dateAndTime}
              </Typography>
            </div>
            {/* City & Time */}
            <hr />
            {/* Degree & Description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start',
                  flexDirection: 'column',
                }}
              >
                {/* Temp */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1" style={{ textAlign: 'right' }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CircularProgress
                          size={40}
                          thickness={4}
                          style={{ color: 'white' }}
                        />
                      </Box>
                    ) : (
                      `${temp.currentTemp}°C`
                    )}
                  </Typography>
                  {/* Temp Image */}
                  {loading ? null : (
                    <img
                      src={`http://openweathermap.org/img/wn/${temp.icon}@2x.png`}
                      alt="Current weather icon"
                    />
                  )}
                  {/* Temp Image */}
                </div>
                {/* Temp */}
                {/* Description */}
                <Typography variant="h6">{t(temp.discreption)}</Typography>
                {/* Description */}
                {/* Min And Max */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <h5>
                    {' '}
                    {t('min')}: {temp.min}° | {t('max')}: {temp.max}°
                  </h5>
                </div>
                {/* Min And Max */}
              </div>
              <CloudIcon style={{ fontSize: 200, color: 'white' }} />
            </div>
            {/* Degree & Description */}
          </CardContent>
        </Card>
        {/* translation  */}
        <div
          dir={direction}
          style={{
            display: 'flex',
            justifyContent: 'end',
            width: '100%',
          }}
        >
          <Button
            variant="text"
            style={{
              color: 'white',
              fontSize: '20px',
              textTransform: 'none',
              width: '120px',
            }}
            onClick={handleLanguageClick}
          >
            {locale === 'en' ? 'Arabic' : 'الانجليزية'}
          </Button>
        </div>
        {/* translation  */}
      </Container>
    </ThemeProvider>
  );
}

export default App;
