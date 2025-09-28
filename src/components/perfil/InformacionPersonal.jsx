import React, { useState } from 'react';
import '../../css/Perfil.css';

import {
  Stack,
  Card,
  Typography,
  CardHeader,
  CardContent,
  Divider,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ButtonsMod from '../ButtonsMod';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Íconos
import {
  Info as InfoIcon,
  Cake as CakeIcon,
  MailOutline as MailOutlineIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';

function InformacionPersonal({
  correoElectronico,
  nombre,
  apellido,
  fechaNacimiento,
  celular = '',
  cedula = '',
  onSave,
}) {
  // Edición
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    correoElectronico,
    nombre,
    apellido,
    fechaNacimiento,
    celular,
    cedula,
  });

  // Validaciones
  const [nombreError, setNombreError] = useState(false);
  const [nombreHelperText, setNombreHelperText] = useState('Este campo es opcional');

  const [apellidoError, setApellidoError] = useState(false);
  const [apellidoHelperText, setApellidoHelperText] = useState('Este campo es opcional');

  const [fechaError, setFechaError] = useState(false);
  const [fechaHelperText, setFechaHelperText] = useState('La edad debe ser de entre 18 a 65 años');

  const [celError, setCelError] = useState(false);
  const [celHelper, setCelHelper] = useState('Este campo es opcional');

  const [cedError, setCedError] = useState(false);
  const [cedHelper, setCedHelper] = useState('Este campo es opcional');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'nombre') validarNombre(value);
    if (name === 'apellido') validarApellido(value);
    if (name === 'celular') validarCelular(value);
    if (name === 'cedula') validarCedula(value);
  };

  const handleEdit = () => {
    const next = !isEditing;
    setIsEditing(next);

    if (!next) return; // si acabamos de salir, no toques mensajes

    // Restablece “opcionales” cuando están vacíos
    if (!formData.nombre) {
      setNombreError(false);
      setNombreHelperText('Este campo es opcional');
    }
    if (!formData.apellido) {
      setApellidoError(false);
      setApellidoHelperText('Este campo es opcional');
    }
    if (!formData.celular) {
      setCelError(false);
      setCelHelper('Este campo es opcional');
    }
    if (!formData.cedula) {
      setCedError(false);
      setCedHelper('Este campo es opcional');
    }
  };

  const handleSave = () => {
    // valida lo que venga lleno
    let valid = true;

    if (formData.nombre || nombreError) valid = validarNombre(formData.nombre) && valid;
    if (formData.apellido || apellidoError) valid = validarApellido(formData.apellido) && valid;
    if (formData.celular || celError) valid = validarCelular(formData.celular) && valid;
    if (formData.cedula || cedError) valid = validarCedula(formData.cedula) && valid;
    if (fechaError) valid = false;

    if (valid) {
      onSave?.(formData);
      setIsEditing(false);
    }
  };

  // Nombre
  const validarNombre = (v) => {
    if ((v ?? '').trim() === '') {
      setNombreError(false);
      setNombreHelperText('Este campo es opcional');
      return true;
    }
    const ok = /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(v.trim());
    setNombreError(!ok);
    setNombreHelperText(ok ? '' : 'El nombre debe contener al menos tres letras válidas');
    return ok;
  };

  // Apellido
  const validarApellido = (v) => {
    if ((v ?? '').trim() === '') {
      setApellidoError(false);
      setApellidoHelperText('Este campo es opcional');
      return true;
    }
    const ok = /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(v.trim());
    setApellidoError(!ok);
    setApellidoHelperText(ok ? '' : 'El apellido debe contener al menos dos letras válidas');
    return ok;
  };

  // Celular (10–15 dígitos, opcional)
  const validarCelular = (v) => {
    if ((v ?? '').trim() === '') {
      setCelError(false);
      setCelHelper('Este campo es opcional');
      return true;
    }
    const ok = /^[0-9\s()+-]{10,15}$/.test(v.trim());
    setCelError(!ok);
    setCelHelper(ok ? '' : 'Ingresa entre 10 y 15 dígitos');
    return ok;
  };

  // Cédula (alfanumérica básica, opcional)
  const validarCedula = (v) => {
    if ((v ?? '').trim() === '') {
      setCedError(false);
      setCedHelper('Este campo es opcional');
      return true;
    }
    const ok = /^[a-zA-Z0-9\-]{4,20}$/.test(v.trim());
    setCedError(!ok);
    setCedHelper(ok ? '' : 'Formato no válido (4–20 caracteres)');
    return ok;
  };

  // Fecha de nacimiento
  const handleFechaNacimientoChange = (nuevaFecha) => {
    if (!nuevaFecha) {
      setFechaError(true);
      setFechaHelperText('La edad debe ser de entre 18 a 65 años');
      setFormData((p) => ({ ...p, fechaNacimiento: null }));
      return;
    }
    const edad = dayjs().diff(nuevaFecha, 'year');
    if (edad < 18 || edad > 65) {
      setFechaError(true);
      setFechaHelperText('Edad fuera del rango permitido (18 a 65 años)');
    } else {
      setFechaError(false);
      setFechaHelperText('');
    }
    setFormData((p) => ({ ...p, fechaNacimiento: nuevaFecha.format('DD-MM-YYYY') }));
  };

  const isFormValid = () => {
    // <-- corregido: deben ser todos válidos
    return !nombreError && !apellidoError && !fechaError && !celError && !cedError;
  };

  return (
    <Card className="perfil-usuario-card-informacion-personal" sx={{ p: '1%' }}>
      <CardHeader
        avatar={
          <InfoIcon
            sx={{
              backgroundColor: '#E4007C',
              color: '#FFF',
              borderRadius: '50%',
              p: '4px',
            }}
          />
        }
        title="Información Personal"
        titleTypographyProps={{ sx: { fontSize: '1.2rem', fontWeight: 'medium' } }}
        action={
          <ButtonsMod
            variant="secundario"
            textCont={isEditing ? 'GUARDAR' : 'EDITAR'}
            width="auto"
            height="auto"
            clickEvent={() => {
              if (!isEditing) {
                handleEdit();
              } else if (isFormValid()) {
                handleSave();
              }
            }}
          />
        }
      />

      <Divider variant="middle" sx={{ borderColor: 'rgb(0 0 0 / 12%)' }} />

      <CardContent>
        <Stack direction="column" sx={{ width: '100%' }} spacing={1.5}>
          {/* Correo */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MailOutlineIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Correo Electrónico</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <TextField
                  disabled
                  variant="outlined"
                  size="small"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleInputChange}
                  fullWidth
                />
              ) : (
                <Typography variant="body1">{formData.correoElectronico}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Nombre */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Nombre</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  error={nombreError}
                  helperText={nombreHelperText}
                />
              ) : (
                <Typography variant="body1">{formData.nombre || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Apellido */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Apellido</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  error={apellidoError}
                  helperText={apellidoHelperText}
                />
              ) : (
                <Typography variant="body1">{formData.apellido || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Fecha de nacimiento */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CakeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Fecha de Nacimiento</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    sx={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    value={formData.fechaNacimiento ? dayjs(formData.fechaNacimiento, 'DD-MM-YYYY') : null}
                    maxDate={dayjs().subtract(18, 'year')}
                    minDate={dayjs().subtract(65, 'year')}
                    onChange={handleFechaNacimientoChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: fechaError,
                        helperText: fechaHelperText,
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <Typography variant="body1">
                  {formData.fechaNacimiento
                    ? dayjs(formData.fechaNacimiento, 'DD-MM-YYYY').format('DD-MM-YYYY')
                    : 'Sin especificar'}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Celular */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Celular</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  error={celError}
                  helperText={celHelper}
                />
              ) : (
                <Typography variant="body1">{formData.celular || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Cédula */}
          <Grid container sx={{ width: '100%' }} alignItems="center">
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CreditCardIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Cédula</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  error={cedError}
                  helperText={cedHelper}
                />
              ) : (
                <Typography variant="body1">{formData.cedula || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default InformacionPersonal;
