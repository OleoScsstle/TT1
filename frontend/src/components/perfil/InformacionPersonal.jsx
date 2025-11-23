import React, { useState } from 'react';
import {
  Stack, Card, Typography, CardHeader, CardContent, Divider, TextField,
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
  Home as HomeIcon // <--- Nuevo Icono
} from '@mui/icons-material';

function InformacionPersonal({
  correoElectronico,
  nombre,
  apellido,
  fechaNacimiento,
  celular = '',
  cedula = '',
  direccion = '', // <--- Recibimos la dirección
  onSave,
}) {
  
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    correoElectronico,
    nombre,
    apellido,
    fechaNacimiento,
    celular,
    cedula,
    direccion // <--- Agregamos al estado
  });

  // Validaciones (Simples por ahora)
  const [errores, setErrores] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Aquí podrías agregar validaciones extra si quieres
    onSave?.(formData);
    setIsEditing(false);
  };

  // Manejo de fecha
  const handleFechaNacimientoChange = (nuevaFecha) => {
    const fechaFmt = nuevaFecha ? nuevaFecha.format('YYYY-MM-DD') : null;
    setFormData((p) => ({ ...p, fechaNacimiento: fechaFmt }));
  };

  return (
    <Card sx={{ p: '1%' }}>
      <CardHeader
        avatar={
          <InfoIcon sx={{ backgroundColor: '#E4007C', color: '#FFF', borderRadius: '50%', p: '4px' }} />
        }
        title="Información Personal"
        titleTypographyProps={{ sx: { fontSize: '1.2rem', fontWeight: 'medium' } }}
        action={
          <ButtonsMod
            variant="secundario"
            textCont={isEditing ? 'GUARDAR' : 'EDITAR'}
            clickEvent={() => isEditing ? handleSave() : handleEdit()}
          />
        }
      />

      <Divider variant="middle" sx={{ borderColor: 'rgb(0 0 0 / 12%)' }} />

      <CardContent>
        <Stack direction="column" sx={{ width: '100%' }} spacing={2.5}> {/* Espaciado aumentado */}
          
          {/* Correo (Solo Lectura) */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MailOutlineIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Correo</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
                <Typography variant="body1" fontWeight="bold">{formData.correoElectronico}</Typography>
            </Grid>
          </Grid>

          {/* Nombre */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Nombre</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <TextField fullWidth size="small" name="nombre" value={formData.nombre} onChange={handleInputChange} />
              ) : (
                <Typography variant="body1">{formData.nombre}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Apellido */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Apellido</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <TextField fullWidth size="small" name="apellido" value={formData.apellido} onChange={handleInputChange} />
              ) : (
                <Typography variant="body1">{formData.apellido}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Fecha Nacimiento */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CakeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Nacimiento</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    sx={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    value={formData.fechaNacimiento ? dayjs(formData.fechaNacimiento) : null}
                    onChange={handleFechaNacimientoChange}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </LocalizationProvider>
              ) : (
                <Typography variant="body1">
                  {formData.fechaNacimiento ? dayjs(formData.fechaNacimiento).format('DD-MM-YYYY') : 'Sin especificar'}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Celular */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Celular</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <TextField fullWidth size="small" name="celular" value={formData.celular} onChange={handleInputChange} />
              ) : (
                <Typography variant="body1">{formData.celular || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Dirección (NUEVO CAMPO) */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HomeIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Dirección</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <TextField 
                    fullWidth size="small" 
                    name="direccion" 
                    value={formData.direccion} 
                    onChange={handleInputChange} 
                    placeholder="Calle, Número, Colonia"
                />
              ) : (
                <Typography variant="body1">{formData.direccion || 'Sin especificar'}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Cédula */}
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CreditCardIcon fontSize="small" sx={{ color: '#E4007C' }} />
                <Typography variant="body1" color="#777">Cédula</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              {isEditing ? (
                <TextField fullWidth size="small" name="cedula" value={formData.cedula} onChange={handleInputChange} />
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