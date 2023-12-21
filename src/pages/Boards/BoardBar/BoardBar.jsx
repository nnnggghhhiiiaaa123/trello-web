
import Box from '@mui/material/Box'
import FaceIcon from '@mui/icons-material/Face'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Button, Tooltip } from '@material-ui/core'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from './../../../utils/fomatter'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={board?.type}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: 'a4b0de' }
            }
          }}
        >
          <Tooltip title="nghiadev">
            <Avatar alt="nghiadev" sx={{ width: 30, height: 30 }}
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title="nghiadev">
            <Avatar
              alt="nghiadev"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title="nghiadev">
            <Avatar
              alt="nghiadev"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title="nghiadev">
            <Avatar
              alt="nghiadev"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title="nghiadev">
            <Avatar
              alt="nghiadev"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title="nghiadev">
            <Avatar
              alt="nghiadev"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar