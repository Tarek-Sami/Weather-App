import './App.css';
// React import
import { useEffect, useState, useMemo } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [lat, setLat] = useState(30.033333);
  const [lon, setLon] = useState(31.233334);
  const [city, setCity] = useState('القاهرة');
  const [selectedCity, setSelectedCity] = useState(null);
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
      setCity(selectedCity ? selectedCity.name : city);
    } else {
      setLocale('ar');
      i18n.changeLanguage('ar');
      moment.locale('ar');
      setDateAndTime(moment().format('dddd') + ' ' + moment().format('LL'));
      setDirection('rtl');
      setCity(
        selectedCity ? selectedCity.local_names?.ar || selectedCity.name : city
      );
    }
  }

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('city', JSON.stringify(selectedCity));
    }
  }, [selectedCity]);

  useEffect(() => {
    const saved = localStorage.getItem('city');
    if (saved) setSelectedCity(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (!search || search.trim() === '') {
      setCities([]);
      return;
    }
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=10&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((response) => {
        setCities(response.data);
      })
      .catch(function (error) {
        // handle error
        if (error.code === 'ERR_CANCELED') return;
        console.error(error);

        return () => {
          if (cancelAxios) {
            cancelAxios();
          }
        };
      });
  }, [search]);

  useEffect(() => {
    i18n.changeLanguage(locale);
    setDateAndTime(moment().format('dddd') + ' ' + moment().format('LL'));
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,

        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
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
      if (cancelAxios) {
        cancelAxios();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  const uniqueCities = useMemo(() => {
    const seen = new Set();

    return cities.filter((city) => {
      const key = `${city.name},${city.state || ''},${city.country}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [cities]);

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
        <Autocomplete
          disablePortal
          options={uniqueCities}
          getOptionLabel={(option) =>
            `${option.name}, ${option.state ? option.state + ', ' : ''}${
              option.country
            }`
          }
          isOptionEqualToValue={(option, value) =>
            option.lat === value.lat && option.lon === value.lon
          }
          inputValue={search}
          onInputChange={(event, newValue) => {
            setSearch(newValue);
          }}
          clearOnBlur={false}
          sx={{
            width: 320,
            mb: '16px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '10px',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(28,52,91,0.55)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(28,52,91)',
                borderWidth: '2px',
              },
            },
            '& .MuiInputBase-input': {
              padding: '10px 12px',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0,0,0,0.6)',
              fontWeight: 500,
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgb(28,52,91)',
            },
            '& .MuiSvgIcon-root': {
              color: 'rgb(28,52,91)',
            },
          }}
          componentsProps={{
            paper: {
              sx: {
                mt: 1,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={locale === 'ar' ? 'اختَر مدينة' : 'Select City'}
              placeholder={
                locale === 'ar' ? 'ابحث عن مدينة...' : 'Search a city...'
              }
              variant="outlined"
              size="small"
            />
          )}
          onChange={(e, value) => {
            if (value) {
              setSelectedCity(value);
              console.log('Selected City:', value);
              console.log('Lat:', value.lat, 'Lon:', value.lon);
              setLat(value.lat);
              setLon(value.lon);
              if (locale === 'ar') {
                setCity(value.local_names?.ar || value.name);
              } else {
                setCity(value.name);
              }
              setLoading(true);
            }
          }}
        />
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
                {locale === 'ar' && city === 'Cairo'
                  ? 'القاهرة'
                  : city === 'القاهرة' && locale === 'en'
                  ? 'Cairo'
                  : city}
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
                      src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`}
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
