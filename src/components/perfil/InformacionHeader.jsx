import React, { useState } from 'react';
import '../../css/Perfil.css';

import { Box, Avatar, Stack, Card, Typography } from '@mui/material';
import {
  GroupsRounded as GroupsIcon,
  Bolt as BoltIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

function InformacionHeader({ nombreUsuario, avatar, numeroPacientes = 0, analisisRealizados = 0 }) {
  const [avatarNuevo, setAvatar] = useState(avatar);
  const inicial = nombreUsuario?.charAt(0).toUpperCase();

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Card className="perfil-usuario-header">
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center">
        {/* Avatar */}
        <Box sx={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
          <Avatar
            sx={{ width: 150, height: 150, backgroundColor: '#999999', fontSize: 48 }}
            src={avatarNuevo}
          >
            {!avatarNuevo && inicial}
          </Avatar>

          {/* Botón editar foto */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#FFF',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #E4007C',
            }}
            onClick={() => document.getElementById('avatar-input').click()}
            aria-label="Cambiar foto de perfil"
            role="button"
          >
            <EditIcon color="primary" fontSize="small" />
          </Box>

          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </Box>

        {/* Datos del médico */}
        <Stack direction="column" sx={{ width: '100%' }} className="perfil-usuario-header-informacion">
          <Typography variant="h3" fontWeight={'bold'} className="perfil-usuario-header-username">
            {nombreUsuario}
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginTop: '10px' }}
            className="perfil-usuario-informacion-listado"
          >
            {/* Número de pacientes */}
            <Stack direction="column" spacing={1} alignItems="start" className="perfil-usuario-listado">
              <Typography className="perfil-usuario-header-span fw-medium">Número de pacientes </Typography>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <GroupsIcon className="perfil-usuario-header-icon" />
                <Typography variant="body1" className="perfil-usuario-header-font">
                  {numeroPacientes}
                </Typography>
              </Stack>
            </Stack>

            {/* Análisis realizados */}
            <Stack direction="column" spacing={1} alignItems="start" className="perfil-usuario-listado">
              <Typography className="perfil-usuario-header-span fw-medium">Análisis realizados</Typography>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <BoltIcon className="perfil-usuario-header-icon" />
                <Typography variant="body1" className="perfil-usuario-header-font">
                  {analisisRealizados}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export default InformacionHeader;
